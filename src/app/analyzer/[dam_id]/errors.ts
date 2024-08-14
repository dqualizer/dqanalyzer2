export class DamNotFoundError extends Error {
  constructor({ id }: { id: string }) {
    super(`Dam with id ${id} not found`);
  }
}
