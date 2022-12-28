export class UserDto {
  email;
  id;
  username;
  role;
  lastEnter;
  createdReviews;
  likedReviews;
  ratedArtItems;
  enteredBySocial;

  constructor(model) {
    this.email = model.email;
    this.username = model.username;
    this.id = model._id;
    this.role = model.role;
    this.lastEnter = model.lastEnter;
    this.createdReviews = model.createdReviews;
    this.likedReviews = model.likedReviews;
    this.ratedArtItems = model.ratedArtItems;
    this.enteredBySocial = model.enteredBySocial;
  }
}
