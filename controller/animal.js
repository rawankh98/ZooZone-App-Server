"use strict";
const axios = require("axios");
const pg = require("pg");
const API = process.env.API;

function animal(
  name,
  description,
  family,
  foundingPlace,
  specie,
  habits,
  diet,
  weight,
  height,
  image
) {
  this.name = name;
  this.description = description;
  this.family = family;
  this.foundingPlace = foundingPlace;
  this.specie = specie;
  this.habits = habits;
  this.diet = diet;
  this.weight = weight;
  this.height = height;
  this.image = image;
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  // max: 10, // Adjust the max connections
  // idleTimeoutMillis: 40000, // Close idle clients after 30 seconds
  // connectionTimeoutMillis: 5000, // Return an error after 2 seconds if connection cannot be established
});

const saveFirst = (req, res)=> {
  axios
  .get(`${API}`)
  .then(async (data) => {
    let anim = data.data.map((value) => ({
      name: value.name,
      description: value.description,
      family: value.family,
      place_of_found: value.place_of_found,
      species: value.species,
      habitat: value.habitat,
      diet: value.diet,
      weight_kg: value.weight_kg,
      height_cm: value.height_cm,
      image: value.image,
    }));
    for (const animal of anim) {
     const myData = await saveAnimalData(animal);
     res.send(myData)
    }
  })
  .catch((err) => {
    res.status(500).send(err.message);
  });

}


// get all animals or search for animal or sort in one method
const getAllAnimals =  async (req, res) => {
  const sortQuery = req.query.sort;
  const sortOrder = req.query.order === "dec" ? "dec" : "asc";
  const querySearch = req.query.search;
  if (querySearch) {
    axios
      .get(`${API}?search=${querySearch}`)
      .then((data) => {
        res.send(data.data);
      })
      .catch((err) => {
        res.status(500).send(err.message);
      });
  } else if (sortQuery && sortOrder) {
    axios
      .get(`${API}?sort=${sortQuery}&order=${sortOrder}`)
      .then((response) => {
        res.json(response.data);
      })
      .catch((err) => {
        res.status(500).send(err.message);
      });
  } else {
    let sqlQuery = `SELECT * FROM animals;`
    try{
     const data = await pool.query(sqlQuery)
    res.send(data)
    }catch(err){console.log(err);}
   
  }
};
const saveAnimalData = async (animal) => {
  const query = `
    INSERT INTO animals(name, description, family, place_of_found, specie, habits, diet, weight, height, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`;
  const values = [
    animal.name,
    animal.description,
    animal.family,
    animal.place_of_found,
    animal.species,
    animal.habitat,
    animal.diet,
    animal.weight_kg,
    animal.height_cm,
    animal.image,
  ];
  try {
    await pool.query(query, values)
  } catch (error) {
    console.error("Error saving data to the database", error);
  } 
};

// get animal by id
const getAnimal = (req, res) => {
  const requestParam = req.params.id;
  let sqlQuery = `SELECT * FROM animals WHERE id=${requestParam};`;
  pool
    .query(sqlQuery)
    .then((data) => {
      res.send(data.rows);
    })
    .catch((error) => {
      res.send(error);
    });
};

// add new animal

const addNewAnimal = (req, res) => {
  const requestBody = req.body;
  let newAnimal = [
    requestBody.name,
    requestBody.description,
    requestBody.family,
    requestBody.place_of_found,
    requestBody.specie,
    requestBody.habits,
    requestBody.diet,
    requestBody.weight,
    requestBody.height,
    requestBody.image,
  ];
  let insertQuery = `INSERT INTO animals(name, description, family, place_of_found, specie, habits, diet, weight, height, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`;
  pool
    .query(insertQuery, newAnimal)
    .then((data) => {
      res.send("done !");
    })
    .catch((error) => {
      console.log(error);
    });
};

// update animal
const updateAnimal = (req, res) => {
  const requestBody = req.body;
  const requestParam = req.params.id;
  let updateQuery = `UPDATE animals SET name=$1, description=$2, family=$3, place_of_found=$4, specie=$5, habits=$6, diet=$7, weight=$8, height=$9, image=$10 WHERE id = ${requestParam};`;
  let updateAnimal = [
    requestBody.name,
    requestBody.description,
    requestBody.family,
    requestBody.place_of_found,
    requestBody.specie,
    requestBody.habits,
    requestBody.diet,
    requestBody.weight,
    requestBody.height,
    requestBody.image,
  ];
  pool
    .query(updateQuery, updateAnimal)
    .then((data) => {
      res.status(200).send(data.rows);
    })
    .catch((error) => {
      console.log(error);
    });
};

// delete animal

const deleteAnimal = (req, res) => {
  const requestParam = req.params.id;
  let deleteQuery = `DELETE FROM animals WHERE id = ${requestParam};`;
  pool
    .query(deleteQuery)
    .then((data) => {
      res.status(200).send("Animal deleted successfully");
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  getAllAnimals,
  addNewAnimal,
  getAnimal,
  updateAnimal,
  deleteAnimal,
  saveFirst
};
