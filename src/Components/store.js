import { BehaviorSubject } from 'rxjs';

export const token$ = new BehaviorSubject(window.localStorage.getItem('token') || null);


export function updateToken(newToken) {

  if(!newToken){
    window.localStorage.removeItem('token');
  }
  else{
    window.localStorage.setItem('token', newToken);
  }

 token$.next(newToken);
 //console.log(token$.value)
}

//====================================FAVORITES STORE TOKEN==========================================
export const favorites$ = new BehaviorSubject(JSON.parse(window.localStorage.getItem("favorites") || "[]"));

export function updateFavoriteToken(newFavorites) {

  if(!newFavorites){
    window.localStorage.removeItem("favorites");
  }
  else {
    window.localStorage.setItem("favorites", JSON.stringify(newFavorites));
  }
  favorites$.next(newFavorites)
}