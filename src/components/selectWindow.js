import React from 'react'
import { GithubPicker } from 'react-color';

import './window.css'

  const firstFamilyChilds = ['Christina', "Dimitri", "Paulette", "Louison", "Jean-François"] 
  const secondFamilyChilds = ["Edmond", "Clovis", "Eustache", "Cindy", "Yvette", "Patrice"]

class SelectWindow extends React.Component {

    state = {
      familyId : 1,
      selectedChild : firstFamilyChilds[0],
      childList : [],
      childColor : null
    }

  handleFamilyNumber = (e) => {
    this.setState({familyId : parseInt(e.target.value, 10)})
    setTimeout(() => {
      if (this.state.familyId === 1){
        this.setState({selectedChild: firstFamilyChilds[0]})
      }
      else {
        this.setState({selectedChild: secondFamilyChilds[0]})
      }
      }, 100);
  }

  handleChildNumber = (e) => {
    console.log(e.target.value)
    this.setState({selectedChild : e.target.value})
  }

  addChildToList = () => {
    this.setState({
      childList: [...this.state.childList, 
        {name :this.state.selectedChild,
        family : this.state.familyId,
        color : this.state.childColor,
        start : this.props.hour[0],
        end : this.props.hour[1]}],
        selectedChild : firstFamilyChilds[0]})
  }

  submitChilds = () => {
      let items = JSON.parse(localStorage.getItem('items'));
      if (items === null) {
        items=[]
        this.state.childList.map(allChild => {
          console.log('allChild', allChild)
          items.push({
            name :allChild.name,
            family : allChild.family,
            color : allChild.color,
            start : this.props.hour[0],
            end : this.props.hour[1]})
        })
      }
      else {
        this.state.childList.map(allChild => {
          console.log(allChild)
          items.push({
            name :allChild.name,
            family : allChild.family,
            color : allChild.color,
            start : this.props.hour[0],
            end : this.props.hour[1]})
        })
      }
      console.log('items',items)
      alert(items)
      localStorage.setItem('items', JSON.stringify(items));
    }

    render(){
      console.log(this.state)
      return(
        <div className="Control">
          <div className= "ctrlWindow">
            <h1>Quelques précisions pour valider la plage horaire</h1>
            <p>Heure de début de garde : {this.props.hour[0]}</p>
            <p>Heure de fin de garde : {this.props.hour[1]}</p>
            <div className='calendarChildSelector'>
            <p>Famille de l'enfant concerné par cette plage horaire :</p>
              <select type= "number" onChange={(e) => this.handleFamilyNumber(e)}>
                <option>1</option>
                <option>2</option>
              </select>
              <p>Enfant concerné par cette plage horaire :</p>
              {this.state.familyId === 1 ?
              <select type= "text" onChange={(e) => this.handleChildNumber(e)}>
                {firstFamilyChilds.map(children => (
                  <option 
                    key={children} 
                    value={children}> 
                    {children}
                  </option>
                ))}
              </select>
              :
              <select type= "text" onChange={(e) => this.handleChildNumber(e)}>
                {secondFamilyChilds.map(children => (
                  <option 
                    key={children} 
                    value={children}> 
                    {children}
                  </option>
                ))}
              </select>
              }
              <p>Select Color</p>
              <div className='colorPicker'>
                <div className = 'firstColorPicker'>
                  <span onClick={()=> this.setState({childColor: 'blue'})}><div className='colorPickerOne'></div></span>
                  <span onClick={()=> this.setState({childColor: 'green'})}><div className='colorPickerTwo'></div></span>
                  <span onClick={()=> this.setState({childColor: 'yellow'})}><div className='colorPickerThree'></div></span>
                  <span onClick={()=> this.setState({childColor: 'red'})}><div className='colorPickerFour'></div></span>
                  <span onClick={()=> this.setState({childColor: 'orange'})}><div className='colorPickerFive'></div></span>
                </div>
                <div className = 'secondColorPicker'>
                  <span onClick={()=> this.setState({childColor: 'brown'})}><div className='colorPickerSix'></div></span>
                  <span onClick={()=> this.setState({childColor: 'black'})}><div className='colorPickerSeven'></div></span>
                  <span onClick={()=> this.setState({childColor: 'purple'})}><div className='colorPickerHeight'></div></span>
                  <span onClick={()=> this.setState({childColor: 'lightgreen'})}><div className='colorPickerNine'></div></span>
                  <span onClick={()=> this.setState({childColor: 'lightblue'})}><div className='colorPickerTen'></div></span>
                </div>
              </div>
              <input type="button" value="add" onClick={()=>this.addChildToList()}></input>
            </div>
            <div>
              {this.state.childList.map(child => {
                return (
                  <div>
                    <p>{child.name}</p>
                    <p>{child.color}</p>
                    <p>{child.familyId}</p>
                  </div>
                )
              })}
            </div>
            <input type="button" value="comfirm" onClick={()=>this.submitChilds()}></input>
          </div>
        </div>
      )
    }
}
export default SelectWindow

