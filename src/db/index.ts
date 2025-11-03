import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
	process.env.SUPABASE_URL!,
	process.env.SUPABASE_KEY!,
);

export interface ITransaction {
	id?: string;
	userId: number;
	type: 'entry' | 'exit';
	amount: number;
	description: string;
	date: Date;
}

export async function addTransaction(
	userId: number,
	type: 'entry' | 'exit',
	amount: number,
	description: string,
	date: Date
) {
	const { data, error } = await supabase
		.from('transactions')
		.insert([{
			user_id: userId,
			type,
			amount,
			description,
			date: date.toISOString().slice(0, 10),
		}]);

	if (error) throw error;
	return data;
}

export async function getBalanceMonth(
	userId: number,
	year: number,
	month: number
) {
	const { data, error } = await supabase.rpc('get_monthly_totals', {
		p_user_id: userId,
		p_year: year,
		p_month: month
	});

	if (error) throw error;
	
	console.log(data)
	
	return data;
}

export async function getAllForUser(userId: number) {

	const { data, error } = await supabase
		.from('transactions')
		.select('*')
		.eq('user_id', userId);

	if (error) throw error;

	return data!;
}