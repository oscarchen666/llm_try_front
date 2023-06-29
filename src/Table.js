import React from 'react';
// import './MyComponent.css';    
  
class Table extends React.Component {  
  render() {  
    // const { className, data, maxHeight } = this.props; 
    return (  
      <table className={this.props.className} >  
        <thead>  
          <tr>  
            <th>事件ID</th>    
            <th>地点</th>  
            <th>主角</th>    
            <th>对象</th>  
            <th>开始时间</th>  
            <th>结束时间</th>  
            <th>事件类型</th> 
            <th>描述</th> 
          </tr>  
        </thead>  
        <tbody>  
          {this.props.data.map((item, index) => (  
            <tr key={index}>   
              <td>
                <span className="clickable-id" onClick={() => this.props.onClick(item.id,item.notime,item.noaddr)} >
                  {item.id}
                  </span>
              </td>    
              <td>{item.place}</td>    
              <td>{item.mainCharacter}</td>    
              <td>{item.object}</td>  
              <td>{item.startTime}</td>  
              <td>{item.endTime}</td>  
              <td>{item.eventType}</td> 
              <td>{item.detail}</td>
            </tr>  
          ))}  
        </tbody>  
      </table>  
    );  
  }  
}  
  
export default Table;  