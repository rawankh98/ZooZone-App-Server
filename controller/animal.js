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
  max: 10, // Limit the number of connections
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000// Return an error after 2 seconds if connection cannot be established
});

// get all animals or search for animal or sort in one method
const getAllAnimals = (req, res) => {
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
        console.log(err);
        res.status(500).send(err.message);
      });
  } else if (sortQuery && sortOrder) {
    axios
      .get(`${API}?sort=${sortQuery}&order=${sortOrder}`)
      .then((response) => {
        res.json(response.data);
      })
      .catch((err) => {
        console.log("dooooo");
        res.status(500).send(err.message);
      });
  } else {
    axios
      .get(`${API}`)
      .then((data) => {
        let anim = data.data.map((value) => ({
          name: value.name,
          description: value.description,
          family: value.family,
          foundingPlace: value.foundingPlace,
          specie: value.specie,
          habits: value.habits,
          diet: value.diet,
          weight: value.weight,
          height: value.height,
          image: value.image,
        }));
        for (const animal of anim) {
          saveAnimalData(animal);
        }

        res.send(anim);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err.message);
      });
  }
};
const saveAnimalData = async (animal) => {
  const client = await pool.connect();
  const query = `
    INSERT INTO animals(name, description, family, place_of_found, specie, habits, diet, weight, height, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`;
  const values = [
    animal.name,
    animal.description,
    animal.family,
    animal.foundingPlace,
    animal.specie,
    animal.habits,
    animal.diet,
    animal.weight,
    animal.height,
    animal.image,
  ];
  try {
    await client.query(query, values);
  } catch (error) {
    console.error("Error saving data to the database", error);
  } finally {
    client.release();
  }
};

// get animal by id
const getAnimal = (req, res) => {
  const requestParam = req.params.id;
  let sqlQuery = `SELECT * FROM animals WHERE id=${requestParam};`;
  pool
    .query(sqlQuery)
    .then((data) => {
      console.log("newwwwwwwwwwwwwwwwwwwwwwwww", data);
      res.send(data.rows);
    })
    .catch((error) => {
      res.send(error);
    });
};

// add new animal

const addNewAnimal = (req, res) => {
  const requestBody = req.body;
  console.log("name: ", requestBody.name);
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
};
