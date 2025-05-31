import type { Locale } from "./locale";

export type Work = {
	id: string;
	title: string;
	date: Date;
}

export type Piece = Work & {
	size: string;
	material: {
		[k in Locale]: string;
	};
	imageUrl: string;
	description: {
		[k in Locale]: string;
	}
};

export type Series = Work & {
	pieces: Piece[];
};

export function isPiece(work: Work): work is Piece {
	return (work as Piece).size !== undefined;
}

export function isSeries(work: Work): work is Series {
	return (work as Series).pieces !== undefined;
}