import React, {Component} from 'react';
import './App.css';
import Form from './Form'
import axios from 'axios';


// TO DO on Sunday, Sept. 15,
// Make component and modal to display healthy and junk food nutrients
// Finish error handling for form
// Create header component and JSX elements to be rendered
// Create saved pairs component that will hold user's saved combinations of healthy food + junk food
// Set up firebase storing + deleting
// Set up routing to display comparison modal + saved pairs component 

class App extends Component {
  constructor(){
    super();
    this.state = {
      userInput: '',
      junkFood : {},
      healthyFood: {},
      junkFoodSugar: '',
      healthySugar: '',
      healthyFat: '',
      healthyCalories: '',
      healthyProtein: '',
      healthyCarbs: '',
    }
  }
  
  // getInfoFromForm = (event) =>{
  //   event.preventDefault();
  //   this.getFoods();
  // }

  getNutrientValue = (nutNum, array) => {
    const nutrient = array.filter(sugarObject =>{
        return sugarObject.attr_id === nutNum
    })
    return nutrient[0].value
  }

  handleChange = (event) =>{
    this.setState({
        userInput: event.target.value
    })

  }
  
  getFoods = () => {
    axios({
        url: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
        dataResponse: 'JSON',
        method: 'POST',
        data: {
             "query": this.state.userInput,
             "use_branded_foods": false,
        },
        headers: {
        'x-app-id': '9e2a04b3',
        'x-app-key': '58f30814d5c13971f51720cf37a6b7f7',
        },
    }).then((response) => {
        this.setState({
          // NOTE for modal: to access micronutrients later, just use this.state.junkFood.nf_[nameOfNutrient]
            junkFood: response.data.foods[0],
            junkFoodSugar: response.data.foods[0].nf_sugars
        })
    }).then(()=>{
        axios({
        url: 'https://trackapi.nutritionix.com/v2/search/instant/',
        dataResponse: 'JSON',
        method: 'POST',
        data: {
            "query": this.state.userInput,
            "detailed": true,
            "common": true,
            "common_grocery": false,
            "common_restaurant": false,
            "branded": false,
            "full_nutrients": {
            "269": {
                "lte": (this.state.junkFoodSugar) - 10
            },
            }
        },
        headers: {
            'x-app-id': '9e2a04b3',
            'x-app-key': '58f30814d5c13971f51720cf37a6b7f7',
        }
        }) .then((results)=>{
            console.log(results);
            this.setState({
                healthyFood: results.data.common[Math.floor(Math.random()*results.data.common.length)]
            })               
            // console.log(this.state.healthyFood);
        }) .then(() =>{
            const sugar = this.getNutrientValue(269,  this.state.healthyFood.full_nutrients);
            const fat = this.getNutrientValue(204,  this.state.healthyFood.full_nutrients);
            const protein = this.getNutrientValue(203,  this.state.healthyFood.full_nutrients);
            const carbs = this.getNutrientValue(205,  this.state.healthyFood.full_nutrients);
            const calories = this.getNutrientValue(208,  this.state.healthyFood.full_nutrients);

            this.setState({
                healthySugar: sugar,
                healthyFat: fat,
                healthyProtein: protein,
                healthyCarbs: carbs,
                healthyCalories: calories,
            })
            console.log(this.state.healthySugar);
        })

    })
    // .catch(error =>{
    //     alert(`we broke it!`)
    // })
}

  render(){
    return (
      <div className="App">

        <Form handleChange={this.handleChange} getFoods={this.getFoods} />
        <p>{this.state.healthyFood.food_name} has {(this.state.junkFoodSugar - this.state.healthySugar)} fewer grams of sugar than {this.state.junkFood.food_name}</p>

        <div><h2>Healthy Nutrients</h2>
        <ul>
            <li>Sugar: {this.state.healthySugar}</li>
            <li>Fat: {this.state.healthyFat}</li>
            <li>Calories: {this.state.healthyCalories}</li>
            <li>Protein: {this.state.healthyProtein}</li>
            <li>Carbs: {this.state.healthyCarbs}</li>
        </ul>
        </div>
        <ul>
          <h2>Junk food nutrients</h2>
          <li>Sugar: {this.state.junkFoodSugar}</li>
          <li>Fat: {this.state.junkFood.nf_total_fat}</li>
          <li>Calories: {this.state.junkFood.nf_calories}</li>
          <li>Protein: {this.state.junkFood.nf_protein}</li>
          <li>Carbs: {this.state.junkFood.nf_total_carbohydrate}</li>
        </ul>
      <div>

      </div>

      </div>
    );
  }
}

export default App;



//THIS WAS OUR 'GET' AXIOS CALL:


// working axios call
  // axios({
  //   url: 'https://trackapi.nutritionix.com/v2/search/instant',
  //   dataResponse: 'JSON',
  //   method: 'GET',
  //   params: {
  //     'detailed': true,
  //     'query': 'pizza',
  //     'branded': false,
  //     'self': false, 
  //   },
  //   headers: {
  //     'x-app-id': '4424dc15',
  //     'x-app-key': 'adf9b4e2b35bea41e8e10c775b249104',
  //     'content-type': 'application/x-www-form-urlencoded',
  //   }
  // }).then((response) => {
  //   console.log(response);
  // })