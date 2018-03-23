import React from 'react';
import $ from 'jQuery';

class Rover extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			aRovers: [],
			plateauX: 0,
			plateauY: 0
		};

		// bind readInstruction function here, so it's not rebound each time the dom is updated
		this.readInstruction = this.readInstruction.bind(this);
		this.checkCommand = this.checkCommand.bind(this);
		this.checkMoveReadiness = this.checkMoveReadiness.bind(this);
		this.moveRover = this.moveRover.bind(this);
	}

	// function to move the rover according to instructions given
	moveRover(rover) {
		var instr = rover.instructions,
			curDirection = rover.curDirection.toLowerCase();

		// loop through instructions
		for(var i=0; i < instr.length; i++){
			var curInstr = instr[i].toLowerCase();
			
			// m = move 1 space
			if(curInstr == 'm'){
				if(curDirection == 'n'){
					// move up 1 pt
					rover.landingPointY++;

					// if we're 1 above the plateau height, alert user
					if(rover.landingPointY > this.state.plateauY){
						alert('You\'ve fallen off the plateau!');
						return false;
					}
				} else if(curDirection == 's'){
					// move up 1 pt
					rover.landingPointY--;

					// if we're 1 below 0, alert user
					if(rover.landingPointY < 0){
						alert('You\'ve fallen off the plateau!');
						return false;
					}
				} else if(curDirection == 'w'){
					// move up 1 pt
					rover.landingPointX--;

					// if we're 1 below 0, alert user
					if(rover.landingPointX < 0){
						alert('You\'ve fallen off the plateau!');
						return false;
					}
				} else if(curDirection == 'e'){
					// move up 1 pt
					rover.landingPointX++;

					// if we're 1 above plateauX, alert user
					if(rover.landingPointX > this.state.plateauX){
						alert('You\'ve fallen off the plateau!');
						return false;
					}
				}
			} else if(curInstr=='n' || curInstr=='s' || curInstr=='e' || curInstr=='w'){ 
				// if not instruction to move, instruction is to set the direction
				rover.curDirection = curInstr;
				curDirection = curInstr;
			}
		}

		return true;
	}

	checkCommand() {
		let curInstruction = $('#instructions').val(),
			roverIndex = this.state.aRovers.length - 1;

		// check for landing point
		let landingPt = curInstruction.toLowerCase().search("landing:");

		if(landingPt >= 0){
			// eliminate "Landing:" from instruction
			let instrStartPos = landingPt + 8;

			// check if space after :. If there is, set start of coordinates to 1 place more to eliniate the space
			if(curInstruction.slice(instrStartPos, instrStartPos+1) == ' '){
				instrStartPos++;
			}

			// set end position to allow for instruction "3 4 N"
			let instrEndPos = instrStartPos + 5;

			// slice out landing pt instruction, should be 11 characters long (ie: "Landing:5 5 N")
			let landingData = curInstruction.slice(instrStartPos, instrEndPos);

			// set plateau size coordinates
			let aRovers = [...this.state.aRovers]; // create the copy of state array

			aRovers[roverIndex].landingPointX = landingData.slice(0, 1);
			aRovers[roverIndex].landingPointY = landingData.slice(2, 3);
			aRovers[roverIndex].curDirection = landingData.slice(4, 5);

			this.setState({ aRovers }); //update the state

			// if landing off of plateau, alert user
			if(landingData.slice(0, 1) > this.state.plateauX || landingData.slice(2, 3) > this.state.plateauY){
				alert('You landed off of the plateau!');

				// remove the fallen rover from the array
				aRovers = [...this.state.aRovers];
				aRovers.splice(roverIndex, 1);
				this.setState({ aRovers });

				return;
			}
		}

		// check for instructions
		var instrPt = curInstruction.toLowerCase().search("instructions:");

		if(instrPt >= 0){
			// eliminate "Instructions:" from instruction
			let instrStartPos = instrPt+13;

			// check if space after :. If there is, set start of coordinates to 1 place more to eliniate the space
			if(curInstruction.slice(instrStartPos, instrStartPos+1) == ' '){
				instrStartPos++;
			}

			// slice out instructions, should be 13+ characters long (ie: "instructions:5 5")
			let aRovers = [...this.state.aRovers]; // create the copy of state array

			aRovers[roverIndex].instructions = curInstruction.slice(instrStartPos);

			this.setState({ aRovers }); //update the state
		}

		this.checkMoveReadiness( roverIndex );
	}

	checkMoveReadiness(roverIndex) {
		// if plateau is defined and rover has landed and instructions have been sent, move the rover
		if(this.state.plateauX != '' && this.state.plateauY != ''
			&& this.state.aRovers[roverIndex].landingPointX !== undefined
			&& this.state.aRovers[roverIndex].instructions !== undefined
		){
			let moveSuccessful = this.moveRover( this.state.aRovers[roverIndex] );

			// if rover fell off the plateau, remove it from the array
			if(!moveSuccessful){
				// remove the fallen rover from the array
				let aRovers = [...this.state.aRovers];
				aRovers.splice(roverIndex, 1);
				this.setState({ aRovers });
			} 
		}
	}

	readInstruction() {
		let curInstruction = $('#instructions').val();
		let roverIndex = 0;

		// check plateau dimensions
		let plateau = curInstruction.toLowerCase().search("plateau:");

		if(plateau >= 0){
			// eliminate "Plateau:" from instruction
			let instrStartPos = plateau+8;

			// check if space after :. If there is, set start of coordinates to 1 place more to eliniate the space
			if(curInstruction.slice(instrStartPos, instrStartPos+1) == ' '){
				instrStartPos++;
			}

			let instrEndPos = instrStartPos + 3;

			// slice out plateau instruction, should be 3 characters long (ie: "5 5")
			let platInstr = curInstruction.slice(instrStartPos, instrEndPos);

			$('#platDimensions').html(result);
			// set plateau size coordinates
			this.setState({plateauX: platInstr.slice(0, 1), plateauY: platInstr.slice(2, 3)})

			let result = `Plateau: ${platInstr.slice(0, 1)} ${platInstr.slice(2, 3)}`;
			$('#platDimensions').html(result);
		} else {
			// find index of first space to set rover name
			let endOfName = curInstruction.search(' ');
			let roverName = curInstruction.slice(0, endOfName);

			// check if this rover is already in our array. If not, add it and set the roverName
			let roverIndex = this.state.aRovers.findIndex(x => x.roverName === roverName);

			if(roverIndex == -1){
				this.setState({ aRovers: [...this.state.aRovers, {roverName: roverName}] }, function(){
					this.checkCommand();
				});
			} else {
				this.checkCommand();
			}
		}
	}

	render() {
		// display current position of rover that has landed
		const RoverStatus = ({rover}) => {
			if(rover.landingPointX !== undefined){
				return (
					<div>
						{rover.roverName}: {rover.landingPointX} {rover.landingPointY} {rover.curDirection}
					</div>
				);
			} else {
				return (
					<div></div>
				)
			}
		};

		return (
			<div style={{padding: 20 + 'px'}}>
				<div className="row">
					<div className="col-md-12">
						<h3>Mars Rover Plateau Navigation</h3>
						Commands:
							<ul>
							<li>Plateau:X Y (set the size of the plateau to navigate)</li>
							<li>Rover1 Landing:X Y Direction (sets the landing point of the rover)</li>
							<li>Rover1 Instructions:MEMWMNMS (gives movement instructions to the rover)
								<ul>
									<li>M: move forward 1 square</li>
									<li>N, S, E, W: set orientation of rover</li>
								</ul>
							</li>
						</ul>
					</div>
					<div className="col-md-6">
						<input type="text" id="instructions" className="form-control" />
					</div>
					<div className="col-md-2">
						<input type="submit" id="submitBtn" value="Execute Command" onClick={this.readInstruction} className="btn btn-primary" />
					</div>
				</div>
				<div className="row">
					<div className="col-md-6">
						<div style={{paddingTop: 20 + 'px'}} id="platDimensions"></div>

						{this.state.aRovers.map(rover =>
				        	<RoverStatus key={rover.roverName} rover={rover} />
				        )}
					</div>
				</div>
			</div>
		);
	}
}

// render to the dom
/*render(
  <Rover />,
  document.getElementById('app')
);*/

module.exports = Rover;