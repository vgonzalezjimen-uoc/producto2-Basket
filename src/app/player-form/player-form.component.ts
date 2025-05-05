import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService, Player } from '../player.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Component({
  standalone: true,
  selector: 'app-player-form',
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.css'],
  imports: [CommonModule, FormsModule]
})
export class PlayerFormComponent implements OnInit {
  player: Player = {
    id: '',
    name: '',
    age: null,
    team: '',
    imageUrl: '',
    videoUrl: ''
  };

  isEditMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playerService: PlayerService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ngOnInit cargado, ID:', id);

    if (id && id !== 'nuevo') {
      this.isEditMode = true;
      this.playerService.getPlayerById(id).subscribe(player => {
        if (player) {
          this.player = { id, ...player };
        }
      });
    } else {
      this.isEditMode = false;
      this.player = {
        id: '',
        name: '',
        age: null,
        team: '',
        imageUrl: '',
        videoUrl: ''
      };
    }
  }

  async onFileSelected(event: any, type: 'image' | 'video') {
    const file = event.target.files[0];
    console.log("Archivo seleccionado:", file);
    if (!file) return;

    const storage = getStorage();
    const filePath = `${type}s/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filePath);

    try {
      await uploadBytes(storageRef, file);
      console.log("Subida completa:", storageRef.fullPath)
      const downloadURL = await getDownloadURL(storageRef);
      console.log(`${type} subida. URL:`, downloadURL);

      if (type === 'image') {
        this.player.imageUrl = downloadURL;
      } else {
        this.player.videoUrl = downloadURL;
      }
    } catch (error) {
      console.error('Error subiendo archivo:', error);
    }
  }

  onSubmit() {
    if (!this.player.name || !this.player.age || !this.player.team) {
      alert('Completa todos los campos obligatorios');
      return;
    }
  
    if (!this.player.imageUrl || !this.player.videoUrl) {
      alert('Sube imagen y video antes de guardar');
      return;
    }

    if (this.isEditMode && this.player.id) {
      this.playerService.updatePlayer(this.player.id, this.player).then(() => {
        alert('Jugador actualizado!');
        this.router.navigate(['/']);
      });
    } else {
      const newPlayer = { ...this.player };
      delete newPlayer.id;
      this.playerService.addPlayer(newPlayer).then(() => {
        alert('Jugador añadido!');
        this.router.navigate(['/']);
      });
    }
  }
}
