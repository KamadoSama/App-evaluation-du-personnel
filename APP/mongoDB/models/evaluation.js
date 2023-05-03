const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema({
    ponctualite: { type: Number, required: true,   },
    sociabilite: { type: Number, required: true,   },
    respectFichePoste: { type: Number, required: true,   },
    participatif: { type: Number, default:0 },
    mois: { type: String, required: true },
    evaluateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    evaluer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    totalMois: { type: Number, default: 0 }
  });
  
  evaluationSchema.pre('save', function(next) {
    const fieldsToSum = ['ponctualite', 'sociabilite', 'respectFichePoste', 'participatif'];
    const self = this;
  
    if (self.isModified(fieldsToSum) || !self.totalMois) {
      const total = fieldsToSum.reduce((acc, field) => acc + self[field], 0);
      self.totalMois = total;
    }
  
    next();
  });
  
const evaluationModel = mongoose.model('Evaluation',evaluationSchema);

module.exports = evaluationModel;
