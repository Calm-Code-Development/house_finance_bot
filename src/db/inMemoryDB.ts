import type { Transaction } from "./entities/transaction"

export class InMemoryDB {
	private static instance: InMemoryDB;

	private transactions: Transaction[] = [];

	private constructor() {}

    public static getInstance(): InMemoryDB {
        if (!InMemoryDB.instance) {
            InMemoryDB.instance = new InMemoryDB();
        }
        return InMemoryDB.instance;
    }

	addTransaction(transaction: Transaction) {
		this.transactions.push(transaction)
	}

	getBalanceMonth(userId: number, year: number, month: number) {
		const transactionOnMonth = this.transactions.filter(transaction => {
			if (transaction.userId !== userId) return false;

			const trasactionMonth = transaction.date.getMonth() + 1;
			const transactionYear = transaction.date.getFullYear();

			return month === trasactionMonth && year === transactionYear;
		});

		return transactionOnMonth.reduce((balance, transaction) => (
			transaction.type === 'entry'
			 	? balance + transaction.amount
				: balance - transaction.amount
		), 0)
	}

	getAllForUser(userId: number) {

		return this.transactions.filter(transaction => transaction.userId === userId);
	}
}

export default InMemoryDB.getInstance();