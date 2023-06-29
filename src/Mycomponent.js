import axios from 'axios'; 
import id2name from './data/id2name.json';
import id2addr from './data/id2addr.json';    
import React from 'react';  
import Input from './Input';  
import Table from './Table';  
import './MyComponent.css';  
const name2id = {}; 
for (const id in id2name) {  
  const name = id2name[id];  
  name2id[name] = id;  
}  

class MyComponent extends React.Component {  
  constructor(props) {  
    super(props);  
    this.state = {  
      inputValue: '王安石',
      idValue:"输入人名点击查询",    
      rightTableData: [],   
      leftTableData:[],
    }; 
  }
    
  
  handleInputChange = (event) => {  
    this.setState({ inputValue: event.target.value });  
  };  
  handleButtonClick = () => {  
    const inputValue = this.state.inputValue;  
    console.log('输入框的内容：', inputValue);
    console.log('对应id：', name2id[inputValue]);
    const newSpanText = '正在查询id为'+ name2id[inputValue] +'的人物';
    this.setState({ idValue: newSpanText });
    axios.get(`http://aailab.cn:28083/getPersonEvents?person_id=${name2id[inputValue]}`)
      .then(response => {  
        // 请求成功，处理响应数据  
        const responseData = response.data;  
        console.log('响应数据：', responseData);
        const leftTableData = this.renderTableData(responseData, 0,0)
        this.setState({ leftTableData }); // 更新组件的状态  
        const newSpanText = '已查询到id为'+ name2id[inputValue] +'的人物的全部事件';
        this.setState({ idValue: newSpanText });  
      })  
      .catch(error => {  
        // 请求失败，处理错误  
        console.error('请求失败a：', error);
        const newSpanText = '查询出错，请检查人名和网络';
        this.setState({ idValue: newSpanText });  
      }); 
  }

  handleClick = (id,notime,noaddr) =>{
    //后两个参数表示主事件是否缺少时间和地点
    const newSpanText = '正在查询事件'+ id +'的相关事件';
    this.setState({ idValue: newSpanText });
    axios.get(`http://aailab.cn:28083/getRelatedEvents?event_id=${id}&event_num=30`)
    .then(response => {  
      // 请求成功，处理响应数据  
      const responseData = response.data;  
      console.log('响应数据：', responseData);
      const rightTableData = this.renderTableData(responseData.data, notime ,noaddr)
      this.setState({ rightTableData }); // 更新组件的状态  
      const newSpanText = '已查询到'+ id +'事件的相关事件并进行筛选';
      this.setState({ idValue: newSpanText });  
    })  
    .catch(error => {  
      // 请求失败，处理错误  
      console.error('请求失败a：', error);
      const newSpanText = '查询出错，请检查网络';
      this.setState({ idValue: newSpanText });  
    });
  }

  donotClick = (id) =>{ 
    const newSpanText = this.state.idValue+'\n你点这个干啥';
    this.setState({ idValue: newSpanText });
  }

  renderTableData(responseData, filtertime, filteraddr) {   
    const tableData = [];  
    const eventsArray = Object.values(responseData.events); // 将responseData.events转换为数组
    for (const event of eventsArray) {  
      let mainCharacter = '';  
      let object = '';
      let startTime= '';
      let endTime= '';
      let addrs = '';
      let notime = 1;//默认没时间
      let noaddr = 1;
    
      for (const role of Object.values(event.roles)) {  
        if (role.role === '主角') {  
          mainCharacter = role.person.split("_")[1];
          mainCharacter = id2name[mainCharacter];  
        } else if (role.role === '对象') {  
          object = role.person.split("_")[1]; 
          object = id2name[object];  
        }  
      }
      if (event.time_range[0]!==-9999) {
        startTime = event.time_range[0];
        notime = 0;
      }  
      if (event.time_range[1]!==9999) {
        endTime = event.time_range[1];
        notime = 0;
      }
      if (event.addrs.length > 0) {
        for (const addr of event.addrs){
          addrs = addrs+id2addr[addr.split("_")[1]];
        }
        noaddr = 0;        
      }
      if (filtertime===1 && filteraddr===0 && notime===1){continue}//只要时间但你没有
      if (filtertime===0 && filteraddr===1 && noaddr===1){continue}//只要地点但你没有
      if (filtertime===1 && filteraddr===1 && notime===1 && noaddr===1){continue}//时间地点有一个就行但你都没有
      const tableRow = {  
        id: event.id,  
        place: addrs,  
        mainCharacter: mainCharacter,  
        object: object,  
        startTime: startTime,  
        endTime: endTime,  
        eventType: event.trigger.split("_")[0],
        detail: event.detail,
        notime: notime,
        noaddr: noaddr
      };  
    
      tableData.push(tableRow);  
    }  
    
    return tableData;  
  }

  render() {  
    return (  
      <div className="container">  
        <Input value={this.state.inputValue} nameid={this.state.idValue} 
          onChange={this.handleInputChange} 
          onClick={this.handleButtonClick}/>  
        <div className="table-container">
          <div className="table-wrapper">
            <Table className="left-table" onClick={this.handleClick} data={this.state.leftTableData} />
          </div>  
          <div className="table-wrapper">  
            <Table className="right-table" onClick={this.donotClick} data={this.state.rightTableData} /> 
          </div>
        </div>  
      </div>  
    );  
  }  
}
  
  
export default MyComponent;  