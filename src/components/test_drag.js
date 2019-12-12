import React from 'react'
	  import moment from 'moment'
	  import SelectWindow from './selectWindow'
      
	  import './test.css'
	  import './utils/fonts/Hansief.ttf'
		  
	  	let startSelect
		let endSelect
		let isDragging = false;
		let element = null;
		let element2 = null
		let helper = null;
		let hours = [];
		let mouse = {
			x: 0,
			y: 0,
			startX: 0,
			startY: 0
		};
		let item = []

      export default class Testdrag extends React.Component {
      
          state = {
			items:[],
			selected:[],
			weekIndex : moment().isoWeek(),
        	year : moment().year(),
			active: "",
			width:  0,
			height: 0,
			showWindow : false 
		  }

		/* Define Mouse Position */

		setMousePosition = (e) => {
			let ev = e || window.event; //Moz || IE
			if (ev.pageX) { //Moz
				mouse.x = ev.pageX + window.pageXOffset;
				mouse.y = ev.pageY + window.pageYOffset;
			} else if (ev.clientX) { //IE
				mouse.x = ev.clientX + document.body.scrollLeft;
				mouse.y = ev.clientY + document.body.scrollTop;
			}
		};

		/* Removing Selections if exist */

		removeSelection = () => {
			let oldSelect = document.getElementsByClassName('calendarCell_selected')
			for (let i = oldSelect.length - 1; i >= 0; --i) {
				if (oldSelect[i]) {
					oldSelect[i].classList.remove('calendarCell_selected');
				}
			}
		}

		removeRectangle = () => {
			let oldRect = document.getElementsByClassName('rectangle')
		  	let oldHelper = document.getElementsByClassName('helper-reactangle')
			
			for (let i = oldRect.length - 1; i >= 0; --i) {
			  	if (oldRect[i]) {
					oldRect[i].remove();
			  	}
			}
			for (let i = oldHelper.length - 1; i >= 0; --i) {
			  	if (oldHelper[i]) {
					oldHelper[i].remove();
			  	}
			}
		}

		/* Push first and last selected cells to the state when selection is over*/

		handleCellSelection = (item) => {
			this.setState({selected:[item]})
		}

		validateSelect = () => {
			if (this.state.items.length > 0) {
				let items = JSON.parse(localStorage.getItem('items'));
				if (items === null) {
					items = [{start : this.state.items[0], end : this.state.items[1]}]
				}
				else {
					items.push({start : this.state.items[0], end : this.state.items[1]});
				}
				alert(items)
				localStorage.setItem('items', JSON.stringify(items));
				this.setState({items : []})
			}
			else {
				return null
			}
		}

		/* Start Selection on click */

		handleMouseClick = (cell, bypass) => {
			if (typeof cell != "string" && cell.tagName) {
				let dt = moment(cell.innerText, ["h:mm A"]).format("HH");
				let old = parseInt(dt)
				let now = new Date();
				let newdate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), old + 1, 0)
				let mom = newdate.toISOString().substring(0, newdate.toISOString().length - 5)
				if(this.handleCellSelection()) {
					return this.handleCellSelection(mom, bypass);
				}
			}
			if (this.handleCellSelection()) {
				this.handleCellSelection(cell, bypass);
			}
		  }

		  handleAllClickStarts = (e, n) => {
			let isMouseDown = true;
			this.removeSelection()
			if (e.target.classList.contains("time") ||e.target.classList.contains("time-now")  && !isDragging) {
			  	return this.handleMouseClick(e.target)
			}
			if (e.target.classList.contains("calendarCell") && !e.target.classList.contains("time") && !isDragging) {
				startSelect = e.target.id
			  	this.handleMouseClick(e.target.id)
				mouse.startX = mouse.x;
				mouse.startY = mouse.y;
				element = document.createElement('div');
				element.className = 'helper-reactangle'
				element.style.left = mouse.x + 'px';
				element.style.top = mouse.y + 'px';
				document.body.appendChild(element)
			}
		}

		handleAllClickEnds = (e, n) => {
			endSelect = e.target.id
			this.removeRectangle()
			if (startSelect && endSelect) {
			  	return this.getSelection(startSelect , endSelect)
		  	}
		}

		/* define Selection and push the first and last cells to the state */

		handleRangeSelection = (selected) => {
			if(this.state.selected.length > 0) {
				this.setState({selected:selected , showCtrl:true})
				this.setState({ items:selected , selected:[]});
			}
			else {
				return null
			}
		}

		getSelection = (start , end) => {
			let strt =  moment(start)
			let endd =   moment(end)
			let arr = endd.diff(strt) >0?[start,end]:[end,start];
		  	this.handleRangeSelection(arr, end);
		}

		handleMouseOver = (e) => {
			this.setMousePosition(e)
		   	if (e.buttons === 0) {
			 	return false;
		   	}
		   	e.preventDefault ? e.preventDefault() : e.returnValue = false
			this.removeSelection()
		   	if(element){
			   		element.style.width = Math.abs(mouse.x - mouse.startX) + 'px';
					element.style.height = Math.abs(mouse.y - mouse.startY) + 'px';
					element.style.left = (mouse.x - mouse.startX < 0) ? mouse.x + 'px' : mouse.startX + 'px';
					element.style.top = (mouse.y - mouse.startY < 0) ? mouse.y + 'px' : mouse.startY + 'px';
			}
			if(helper){
					helper.style.left = mouse.x - 10  + 'px';
				   	helper.style.top = (mouse.y - 10 ) + 'px';
				   	if(e.target.classList.contains("calendarCell") && !e.target.classList.contains("time")){
						let strt =  moment(startSelect)
						let endd =   moment(e.target.id)
					 	helper.innerHTML =endd.diff(strt) > 0? strt.format('LT') + ' -- ' + endd.format('LT'): endd.format('LT') + ' -- ' + strt.format('LT')
				   	}
			}
		}

		/* Create a new Div from selected Cells to highlight them */
		
		addRectangleClassName =() => {
			let first = document.getElementById(this.state.items[0])
			let last = document.getElementById(this.state.items[1])
			let horiz = first.getBoundingClientRect();
			let vert = last.getBoundingClientRect();
			element = document.createElement('div');
			element.className = 'rectangle';
			element.style.width = (horiz.right - horiz.left) - 3 + 'px';
			element.style.height = vert.bottom - horiz.top + 'px'
			element.style.left = horiz.left + 'px';
			element.style.top = horiz.top + 'px';
			document.body.appendChild(element)
		}
			

		createSelectionDiv = () => {
			if (this.state.items.length>0){
				if (document.getElementsByClassName('rectangle')){
					let old = document.getElementsByClassName('rectangle') 
					for (let i = old.length - 1; i >= 0; --i) {
					   	if (old[i]) {
						 	old[i].remove();
					   	}
					}
					this.addRectangleClassName()
				}
				else {
					return null
				}
			}
			else {
				if (document.getElementsByClassName('rectangle')){
					let old = document.getElementsByClassName('rectangle') 
					for (let i = old.length - 1; i >= 0; --i) {
					   	if (old[i]) {
						 	old[i].remove();
					   	}
					}
				}
				else {
					return null
				}
			}
		}

		/* Create new Div from selection in local storage */

		getSelect =() => {
			let slot = JSON.parse(localStorage.getItem('items'));
			if (slot != null) {
				slot.map((slot, index) => {
					let first = document.getElementById(slot.start)
					let last = document.getElementById(slot.end)
					let horiz = first.getBoundingClientRect();
					let vert = last.getBoundingClientRect();
					element2 = document.createElement('div');
					element2.className = 'slot';
					element2.style.backgroundColor = slot.color
					element2.style.width = /* (horiz.right - horiz.left)/2 -  */12 + 'px';
					element2.style.height = vert.bottom - horiz.top + 'px'
					element2.style.left = horiz.left + index * 12 + 'px';
					element2.style.top = horiz.top + 'px';
					document.body.appendChild(element2)	
				})
			}
			else {
				return null
			}
		}
		createValidateDiv = () => {
			let slot = JSON.parse(localStorage.getItem('items'));
			if (slot != null && document.getElementById('calendarBodyId')){
				if (document.getElementsByClassName('slot')){
					let old2 = document.getElementsByClassName('slot')
					for (let i = old2.length - 1; i >= 0; --i) {
					   	if (old2[i]) {
						 	old2[i].remove();
					   	}
					}
					this.getSelect()
				}
				else {
					this.getSelect()
				}
			}
			else {
				return null
			}
		}

		/* Define and change Current Week */

		thisWeek = (day) => {
			return moment(this.state.now).day(day).isoWeek(this.state.weekIndex);
		}
	
		nextWeek= () =>{
			this.setState({
				weekIndex : this.state.weekIndex+1,
				items : [],
			});
			this.removeRectangle()
		}

		prevWeek = () => {
			this.setState({
				weekIndex : this.state.weekIndex-1,
				items : []
			});
			this.removeRectangle()
		}

		/* Define and change each hours of the table (15 minutes by cells) */

		createTable = (thisHour) => {
			hours =[]
			for (let minute = 0; minute < 60; minute += 15) {
				let currentTime = `${thisHour}${minute}`
				hours.push(moment(currentTime, "hm").format('HH:mm'));
			}
		}

		/* Listen window dimensions changes */

		updateDimensions = () => {
			this.setState({
			  	height: window.innerHeight, 
			  	width: window.innerWidth
			});
		}
		
		componentDidMount = () => {
			this.removeRectangle();
			this.updateDimensions();
			this.getSelect();
			window.addEventListener("resize", this.updateDimensions);
		}

        render() {

			this.createSelectionDiv()
			this.createValidateDiv()
			
			let columns= [
				{	key: 'Monday', 
					name: `Lun.`,
					day : `${this.thisWeek("Monday").format('DD')}`,
					date: `${this.thisWeek("Monday").format('YYYY-MM-DD ')}`},

				{	key: 'Tuesday', 
					name: `Mar.`,
					day : `${this.thisWeek("Tuesday").format('DD')}`,
					date: `${this.thisWeek("Tuesday").format('YYYY-MM-DD ')}`},
				
				{	key: 'Wednesday', 
					name: `Mer.`,
					day : `${this.thisWeek("Wednesday").format('DD')}`,
					date: `${this.thisWeek("Wednesday").format('YYYY-MM-DD ')}`},
				
				{	key: 'Thursday', 
					name: `Jeu.`,
					day : `${this.thisWeek("Thursday").format('DD')}`,
					date: `${this.thisWeek("Thursday").format('YYYY-MM-DD ')}`},
				
				{
					key: 'Friday', 
					name: `Ven.`,
					day : `${this.thisWeek("Friday").format('DD')}`,
					date: `${this.thisWeek("Friday").format('YYYY-MM-DD ')}`},
				
				{
					key: 'Saturday', 
					name: `Sam.`,
					day : `${this.thisWeek("Saturday").format('DD')}`,
					date: `${this.thisWeek("Saturday").format('YYYY-MM-DD ')}`},
				
				{	key: 'Sunday', 
					name: `Dim.`,
					day : `${this.thisWeek("Sunday").format('DD')}`,
					date: `${this.thisWeek("Sunday").format('YYYY-MM-DD ')}`}
			]

			let rows = [
				{id :'07',hours: '7h'},
				{id :'08', hours: '8h'},
				{id :'09', hours: '9h'},
				{id :'10', hours: '10h'},
				{id :'11', hours: '11h'},
				{id :'12', hours: '12h'},
				{id :'13', hours: '13h'},
				{id :'14', hours: '14h'},
				{id :'15', hours: '15h'},
				{id :'16', hours: '16h'},
				{id :'17', hours: '17h'},
				{id :'18', hours: '18h'},
				{id :'19', hours: '19h'},
				{id :'20', hours: '20h'},
				{id :'21', hours: '21h'},
				{id :'22', hours: '22h'},
			];
			console.log(this.state)
        return (
			
            <div id="someTableId" className="agendaContainer">
				{this.state.items[0] ? 
					<SelectWindow className = "modal" hour={this.state.items}>
					</SelectWindow>
				:null
				}
				<div className="selectWeek">
					<p onClick={()=>this.prevWeek()} className='prevWeek'> &#60; </p>
					<h1 className='currentMonth'>{this.thisWeek("Sunday").format('MMMM YYYY')}</h1>
					<p onClick={()=>this.nextWeek()} className='nextWeek'> &#62; </p>
				</div>
				<table className = "calendarTable" cellPadding='0' cellSpacing='0'>
					<thead>
						<tr>
							<th className='calendarCell head first'></th>
								{columns.map(column => {
									return (
										<th id = {this.thisWeek(column.key).format('YYYY-MM-DD ')} className='calendarCell head'>
											<p className = 'headColumnName'>{column.name} <span className = 'headColumnDay'>{column.day}</span></p>
										</th>
									)
								})
								}
						</tr>
					</thead>
					<tbody 	id="calendarBodyId" className="calendarTableBody" onMouseDown={this.handleAllClickStarts} onMouseUp={this.handleAllClickEnds} 			onMouseOver={this.handleMouseOver}>
					
						{rows.map(row => {
							this.createTable(row.id)
							return (
								<>
									<tr>
										<th className='calendarCell time' draggable='false' rowSpan='5'>{row.hours}</th>
									</tr>
									{hours.map((hour) => {
										return(
											<tr className = "agenda__row   hour-start" draggable='false'>
												{columns.map(column => {
													return (
														<td id ={column.date+hour} className='calendarCell'></td>
													)
												})
												}
											</tr>
										)
									})
									
									}
								</>
							)
						})
						}
					</tbody>
				</table> 
				<input type="button" value="validate selection" onClick={()=>this.validateSelect()}></input>
			</div >
		)
	}
}