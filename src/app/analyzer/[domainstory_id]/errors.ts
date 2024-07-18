export class DomainStoryNotFoundError extends Error {
	constructor({ id }: { id: string }) {
		super(`Domain Story with id ${id} not found`);
	}
}
