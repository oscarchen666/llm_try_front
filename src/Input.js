import React from 'react';  
// import './MyComponent.css';  
  
class Input extends React.Component {  
  
  render() {  
    return (  
      <div className="input-container">  
        <input  
          type="text"  
          className="input"  
          value={this.props.value}  
          onChange={this.props.onChange}  
        />
        <button className="button" onClick={this.props.onClick}>  
          查询  
        </button>
        <span className="readonly-text">{this.props.nameid}</span>
      </div>  
    );  
  }  
}  
  
export default Input;  