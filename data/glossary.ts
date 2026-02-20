import { glossaryAM } from './glossary_data_a_m';
import { glossaryNZ } from './glossary_data_n_z';

export const glossaryTerms = [...glossaryAM, ...glossaryNZ];

export type GlossaryTerm = {
    term: string;
    definition: string;
};
