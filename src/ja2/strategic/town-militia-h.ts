namespace ja2 {
  // header for town militia strategic control module

  // how many militia of all ranks can be in any one sector at once
  export const MAX_ALLOWABLE_MILITIA_PER_SECTOR = 20;

  // how many new green militia civilians are trained at a time
  export const MILITIA_TRAINING_SQUAD_SIZE = 10; // was 6

  // cost of starting a new militia training assignment
  export const MILITIA_TRAINING_COST = 750;

  // minimum loyalty rating before training is allowed in a town
  export const MIN_RATING_TO_TRAIN_TOWN = 20;
}
