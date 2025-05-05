import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerService, Player } from '../player.service';
import { Observable } from 'rxjs';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent {
  players$: Observable<Player[]>;
  editingPlayerId: string | null = null;
  editingPlayer: Player | null = null;

  uploadingImage: Promise<void> | null = null;
  uploadingVideo: Promise<void> | null = null;

  constructor(private playerService: PlayerService) {
    this.players$ = this.playerService.getPlayers();
  }

  delete(id: string) {
    this.playerService.deletePlayer(id);
  }

  startEditing(player: Player) {
    this.editingPlayerId = player.id ?? null;
    this.editingPlayer = { ...player };
  }

  cancelEditing() {
    this.editingPlayerId = null;
    this.editingPlayer = null;
  }

  async onFileSelected(event: any, type: 'image' | 'video') {
    const file = event.target.files[0];
    console.log("Archivo seleccionado:", file);
    if (!file || !this.editingPlayer) return;

    const storage = getStorage();
    const filePath = `${type}s/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filePath);

    const uploadTask = uploadBytes(storageRef, file).then(async () => {
      const url = await getDownloadURL(storageRef);
      if (type === 'image') {
        this.editingPlayer!.imageUrl = url;
      } else {
        this.editingPlayer!.videoUrl = url;
      }
    });

    if (type === 'image') this.uploadingImage = uploadTask;
    if (type === 'video') this.uploadingVideo = uploadTask;
  }

  async updatePlayer() {
    if (this.editingPlayer && this.editingPlayer.id) {
      if (this.uploadingImage) await this.uploadingImage;
      if (this.uploadingVideo) await this.uploadingVideo;

      this.playerService.updatePlayer(this.editingPlayer.id, this.editingPlayer)
        .then(() => this.cancelEditing());
    }
  }
}
