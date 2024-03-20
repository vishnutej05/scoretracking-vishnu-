const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ProblemsSolvedByStudentSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    codechef_last_refreshed: { type: Date, default: new Date(0) },
    codechef_solved: [{ type: Schema.Types.ObjectId, ref: 'Problem' }],
    codeforces_last_refreshed: { type: Date, default: new Date(0) },
    codeforces_solved: [{ type: Schema.Types.ObjectId, ref: 'Problem' }],
    hackerrank_last_refreshed: { type: Date, default: new Date(0) },
    hackerrank_solved: [{ type: Schema.Types.ObjectId, ref: 'Problem' }],
    spoj_last_refreshed: { type: Date, default: new Date(0) },
    spoj_solved: [{ type: Schema.Types.ObjectId, ref: 'Problem' }]
});

const ProblemsSolvedByStudent = mongoose.model('ProblemsSolvedByStudent', ProblemsSolvedByStudentSchema);

module.exports = ProblemsSolvedByStudent;