import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
  docData
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Player {
  id?: string;
  name: string;
  age: number | null;
  team: string;
  imageUrl: string;
  videoUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private firestore: Firestore = inject(Firestore);

  getPlayers(): Observable<Player[]> {
    const playersCollection = collection(this.firestore, 'players');
    return collectionData(playersCollection, { idField: 'id' }) as Observable<Player[]>;
  }

  getPlayerById(id: string): Observable<Player> {
    const playerRef = doc(this.firestore, `players/${id}`);
    return docData(playerRef).pipe(
      map(data => ({ id, ...data } as Player))
    );
  }

  addPlayer(player: Player): Promise<any> {
    const playersRef = collection(this.firestore, 'players');
    return addDoc(playersRef, player);
  }

  updatePlayer(id: string, player: Player): Promise<void> {
    const playerDocRef = doc(this.firestore, `players/${id}`);
    return updateDoc(playerDocRef, { ...player });
  }

  deletePlayer(id: string): Promise<void> {
    const playerDocRef = doc(this.firestore, `players/${id}`);
    return deleteDoc(playerDocRef);
  }
}
