const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProblemSchema = new Schema({
    problem_name: { type: String, required: true },
    problem_id_in_site : { type: String, required: true },
    problem_tags: [{ type: String }],
    problem_href: { type: String, required: true },
});

const Problems=mongoose.model('Problem', ProblemSchema);

const ProblemsBySitesSchema = new Schema({
    CodeChef: [{ type: Schema.Types.ObjectId, ref: 'Problem' }],
    Codeforces: [{ type: Schema.Types.ObjectId, ref: 'Problem' }],
    HackerRank: [{ type: Schema.Types.ObjectId, ref: 'Problem' }],
    Spoj: [{ type: Schema.Types.ObjectId, ref: 'Problem' }],
});

const ProblemsDb=mongoose.model('ProblemsBySites', ProblemsBySitesSchema);
module.exports = {ProblemsDb, Problems};
