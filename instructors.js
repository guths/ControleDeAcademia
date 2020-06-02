const fs = require('fs');
const data = require('./data.json');
const { age , date} = require('./utils')

exports.show = function(req,res){

    const { id } = req.params;

    const foundInstructor = data.instructors.find(function(instructor){
        if(id == instructor.id) return true;
    })

    if(!foundInstructor) return res.send("Instructor not found!");

    

    const instructor = {
        ...foundInstructor,
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(","),
        created_at: new Intl.DateTimeFormat('pt-BR').format(foundInstructor.created_at)
    }

    return res.render("instructors/show", {instructor});

}

exports.post = function(req,res){

    //Object é uma função que cria um objeto
    //Cria um array com as chaves do objeto
    const keys = Object.keys(req.body);

    for(key of keys){
        
        //req.body.key = ""
        if(req.body[key] == ""){
            return res.send('Please, fill all fields')
        }
    }

    let {avatar_url , birth, id, name, services, gender} = req.body

    birth = Date.parse(birth);
    const created_at = Date.now();
    id = Number(data.instructors.length+1);

    data.instructors.push({
        id,
        name,
        avatar_url,
        birth,
        gender,
        services,
        created_at,
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
         if(err) return res.send("Write file error");

         return res.redirect("/instructors")
    })
}  

exports.edit = function(req,res){
    
    const { id } = req.params;

    const foundInstructor = data.instructors.find(function(instructor){
        if(id == instructor.id) return true;
    })

    if(!foundInstructor) return res.send("Instructor not found!");

    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth)
    }

    return res.render('instructors/edit', {instructor})
}

exports.put = function(req,res){
    
    const { id } = req.params;

    const foundInstructor = data.instructors.find(function(instructor){
        if(id == instructor.id) return true;
    })

    if(!foundInstructor) return res.send("Instructor not found!");

    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth)
    }

    data.instructors[ id -1 ] = instructor;

    fs.writeFile("data.json",JSON.stringify(data, null, 2), function(err){
        if (err) return res.send("write error");
    })

    return res.redirect(`/instructors/${id}`);
}