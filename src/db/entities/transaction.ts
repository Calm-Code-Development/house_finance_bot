import { v6 } from 'uuid'

export class Transaction {

	id?: string;
	userId: number;
	type: 'entry' | 'exit';
	amount: number;
	description: string;
	date: Date;

	constructor(
		userId: number,
		type: 'entry' | 'exit',
		amount: number,
		description: string,
		date: Date
	) {
		this.id = v6();
		this.userId = userId;
		this.type = type;
		this.amount = amount;
		this.description = description;
		this.date = date;
	}
}