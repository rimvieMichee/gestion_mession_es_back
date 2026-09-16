import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Téléversement de fichiers (photos/documents joints à une intervention ou
 * une étape) vers Supabase Storage.
 *
 * ⚠️ Hors dossier technique d'origine : ajouté à la demande du 2026-09-16
 * pour permettre un vrai upload depuis le mobile (jusque-là, les pièces
 * jointes n'acceptaient qu'une URL déjà hébergée ailleurs — voir
 * `CreatePieceJointeDto`). Utilise la clé `service_role` (jamais exposée au
 * client) car l'app ne passe pas par l'auth Supabase : c'est ce backend qui
 * agit pour le compte de l'utilisateur, une fois son JWT SAHELYS vérifié.
 */
@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private client: SupabaseClient | null = null;
  private bucketReady = false;

  private readonly bucket = process.env.SUPABASE_STORAGE_BUCKET || 'pieces-jointes';

  private getClient(): SupabaseClient {
    if (this.client) return this.client;

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new InternalServerErrorException(
        "Stockage de fichiers non configuré (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants).",
      );
    }
    this.client = createClient(url, key, { auth: { persistSession: false } });
    return this.client;
  }

  private async ensureBucket(client: SupabaseClient): Promise<void> {
    if (this.bucketReady) return;

    const { data: buckets, error } = await client.storage.listBuckets();
    if (error) {
      this.logger.warn(`Impossible de lister les buckets Supabase Storage : ${error.message}`);
      return;
    }
    if (!buckets.some((b) => b.name === this.bucket)) {
      const { error: createError } = await client.storage.createBucket(this.bucket, {
        public: true,
        fileSizeLimit: '10MB',
      });
      if (createError && !createError.message.includes('already exists')) {
        this.logger.warn(`Impossible de créer le bucket "${this.bucket}" : ${createError.message}`);
        return;
      }
      this.logger.log(`Bucket Supabase Storage "${this.bucket}" créé.`);
    }
    this.bucketReady = true;
  }

  /** Téléverse le fichier et retourne son URL publique. */
  async uploadFile(path: string, buffer: Buffer, mimetype: string): Promise<string> {
    const client = this.getClient();
    await this.ensureBucket(client);

    const { error } = await client.storage.from(this.bucket).upload(path, buffer, {
      contentType: mimetype,
      upsert: false,
    });
    if (error) {
      throw new InternalServerErrorException(`Échec de l'envoi du fichier : ${error.message}`);
    }

    const { data } = client.storage.from(this.bucket).getPublicUrl(path);
    return data.publicUrl;
  }
}
