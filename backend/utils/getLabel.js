function getLabel(category){

 if(category==="medical") return "Patients";
 if(category==="food") return "Guests";
 if(category==="saloon") return "Clients";
 if(category==="consultancy") return "Clients";

}

module.exports = getLabel;