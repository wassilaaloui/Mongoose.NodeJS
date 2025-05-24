
// Import required modules
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB Atlas database (removed deprecated options)
mongoose.connect(process.env.MONGO_URI);

// Check connection
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB Atlas!');
});

mongoose.connection.on('error', (err) => {
  console.log('MongoDB connection error:', err);
});

// Create Person Schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  favoriteFoods: [String]
});

// Create Person model
const Person = mongoose.model('Person', personSchema);

// 1. Create and Save a Record (Modern Version)
const createAndSavePerson = async () => {
  try {
    const person = new Person({
      name: "John Doe",
      age: 25,
      favoriteFoods: ["pizza", "pasta"]
    });

    const savedPerson = await person.save();
    console.log("Created and saved person:", savedPerson);
    return savedPerson;
  } catch (error) {
    console.error("Error creating person:", error);
    throw error;
  }
};

// 2. Create Many Records (Modern Version)
const createManyPeople = async (arrayOfPeople) => {
  try {
    const people = await Person.create(arrayOfPeople);
    console.log("Created many people:", people.length);
    return people;
  } catch (error) {
    console.error("Error creating many people:", error);
    throw error;
  }
};

// 3. Find People by Name (Modern Version)
const findPeopleByName = async (personName) => {
  try {
    const peopleFound = await Person.find({ name: personName });
    console.log(`Found ${peopleFound.length} people named ${personName}`);
    return peopleFound;
  } catch (error) {
    console.error("Error finding people by name:", error);
    throw error;
  }
};

// 4. Find One by Food (Modern Version)
const findOneByFood = async (food) => {
  try {
    const person = await Person.findOne({ favoriteFoods: food });
    console.log(`Found person who likes ${food}:`, person?.name || "None");
    return person;
  } catch (error) {
    console.error("Error finding person by food:", error);
    throw error;
  }
};

// 5. Find Person by ID (Modern Version)
const findPersonById = async (personId) => {
  try {
    const person = await Person.findById(personId);
    console.log("Found person by ID:", person?.name || "Not found");
    return person;
  } catch (error) {
    console.error("Error finding person by ID:", error);
    throw error;
  }
};

// 6. Find, Edit, then Save (Modern Version)
const findEditThenSave = async (personId) => {
  try {
    const person = await Person.findById(personId);
    if (!person) {
      throw new Error("Person not found");
    }
    
    person.favoriteFoods.push("hamburger");
    const updatedPerson = await person.save();
    console.log("Added hamburger to person's favorites:", updatedPerson.name);
    return updatedPerson;
  } catch (error) {
    console.error("Error in find-edit-save:", error);
    throw error;
  }
};

// 7. Find and Update (Modern Version)
const findAndUpdate = async (personName) => {
  try {
    const updatedDoc = await Person.findOneAndUpdate(
      { name: personName },
      { age: 20 },
      { new: true }
    );
    console.log(`Updated ${personName}'s age to 20:`, updatedDoc?.name || "Not found");
    return updatedDoc;
  } catch (error) {
    console.error("Error in find and update:", error);
    throw error;
  }
};

// 8. Remove by ID (Modern Version)
const removeById = async (personId) => {
  try {
    const removedDoc = await Person.findByIdAndRemove(personId);
    console.log("Removed person:", removedDoc?.name || "Not found");
    return removedDoc;
  } catch (error) {
    console.error("Error removing by ID:", error);
    throw error;
  }
};

// 9. Remove Many People (Modern Version)
const removeManyPeople = async () => {
  try {
    const response = await Person.deleteMany({ name: "Mary" });
    console.log("Removed people named Mary:", response.deletedCount);
    return response;
  } catch (error) {
    console.error("Error removing many people:", error);
    throw error;
  }
};

// 10. Query Chain (Modern Version)
const queryChain = async () => {
  try {
    const data = await Person
      .find({ favoriteFoods: "burrito" })
      .sort({ name: 1 })
      .limit(2)
      .select('-age');
    
    console.log("Query chain results:", data.length, "people who like burritos");
    return data;
  } catch (error) {
    console.error("Error in query chain:", error);
    throw error;
  }
};

// Test function to run all examples
const runTests = async () => {
  try {
    console.log("Testing all functions...\n");
    
    // Test data
    const testPeople = [
      { name: "Alice", age: 30, favoriteFoods: ["pizza", "burrito"] },
      { name: "Bob", age: 25, favoriteFoods: ["hamburger", "burrito"] },
      { name: "Mary", age: 28, favoriteFoods: ["salad"] },
      { name: "Mary", age: 32, favoriteFoods: ["burrito", "tacos"] }
    ];

    // 1. Create and save one person
    console.log("1. Creating and saving one person...");
    await createAndSavePerson();

    // 2. Create many people
    console.log("\n2. Creating many people...");
    const createdPeople = await createManyPeople(testPeople);

    // 3. Find people by name
    console.log("\n3. Finding people named Mary...");
    await findPeopleByName("Mary");

    // 4. Find one person by food
    console.log("\n4. Finding person who likes burrito...");
    await findOneByFood("burrito");

    // 5. Find person by ID (using first created person's ID)
    if (createdPeople.length > 0) {
      console.log("\n5. Finding person by ID...");
      await findPersonById(createdPeople[0]._id);

      // 6. Find, edit, then save
      console.log("\n6. Adding hamburger to person's favorites...");
      await findEditThenSave(createdPeople[0]._id);
    }

    // 7. Find and update
    console.log("\n7. Updating Alice's age to 20...");
    await findAndUpdate("Alice");

    // 8. Query chain
    console.log("\n10. Running query chain (find burrito lovers)...");
    await queryChain();

    // 9. Remove many people (do this last)
    console.log("\n9. Removing all people named Mary...");
    await removeManyPeople();

    console.log("\n✅ All tests completed successfully!");

  } catch (error) {
    console.error("❌ Error in tests:", error.message);
  }
};

// Wait for connection then run tests
setTimeout(runTests, 2000);

// Export functions for use in other files
module.exports = {
  Person,
  createAndSavePerson,
  createManyPeople,
  findPeopleByName,
  findOneByFood,
  findPersonById,
  findEditThenSave,
  findAndUpdate,
  removeById,
  removeManyPeople,
  queryChain
};