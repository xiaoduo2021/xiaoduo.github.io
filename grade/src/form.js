import React from 'react'
import { Grid, Form, Button, Message } from 'semantic-ui-react'


class GradeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      expectedGrade: 80,
    };
    this.addNewItem = this.addNewItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }
  componentDidMount() {
    this.prefillItems();
  }
  prefillItems() {
    let items = [
      {
        "name": "A1",
        "mark": 80,
        "portion": 20,
      },
      {
        "name": "Midterm",
        "mark": 60,
        "portion": 30,
      },
      {
        "name": "Final",
        "mark": null,
        "portion": 50,
      }
    ];
    this.setState({ items: items });
  }
  addNewItem() {
    let items = this.state.items;
    items.push(
      {
        "name": null,
        "mark": null,
        "portion": null,
      }
    )
    this.setState({ items: items });
  }
  removeItem(index) {
    console.log(index);

    let items = this.state.items;
    items.splice(index, 1);
    this.setState({ items: items });
  }
  updateCell(index, type, value) {
    const mapping = { 0: "name", 1: "mark", 2: "portion" };
    let items = this.state.items;
    items[index][mapping[type]] = value
    this.setState({ items: items });
    console.log(items);

  }
  calculateGrade() {
    let items = this.state.items;
    // check for data correctness
    let emptyMarks = 0;
    let emptyPortion = 0;
    let totalPortion = 0;

    for (let i of items) {
      if (!i.mark) emptyMarks += 1;
      if (!i.portion) emptyPortion += 1;
      totalPortion += parseFloat(i.portion);
    }

    if (emptyMarks != 1 || emptyPortion != 0 || !this.state.expectedGrade || isNaN(this.state.expectedGrade) || totalPortion !== 100) return null;

    let currentTotal = 0;
    for (let i of items) {
      if (i.mark) {
        currentTotal += parseFloat(i.mark) * (parseFloat(i.portion) / 100)
      }
    }

    const neededMark = this.state.expectedGrade - currentTotal;
    if (neededMark < 0) return 0;

    for (let i of items) {
      if (!i.mark) {
        return neededMark / (parseFloat(i.portion) / 100)
      }
    }

    return 0;

  }
  renderResultMessage() {
    const needed = this.calculateGrade();

    if (needed == null) {
      return (
        <Message negative>
          <Message.Header>您的输入有误</Message.Header>
          <Message.List>
            <Message.Item>请确保已输入所有的占比%</Message.Item>
            <Message.Item>只在一个项目的得分%留空</Message.Item>
            <Message.Item>总占比%必须等于100</Message.Item>
          </Message.List>
        </Message>
      )
    }
    let neededName;
    for (let i of this.state.items) {
      if (!i.mark) {
        neededName = i.name;
        break
      }
    }

    return (
      <Message positive>
        <Message.Header>若想本门课达到{this.state.expectedGrade}分</Message.Header>
        <p>
          您必须要在{neededName}达到{needed.toFixed(1)}%以上
          </p>
      </Message>
    )
  }
  render() {
    const itemLists = this.state.items.map((item, index) =>
      <Grid>
        <Grid.Row>
          <Grid.Column style={{ flex: 1 }}>
            <input onChange={(event) => this.updateCell(index, 0, event.target.value)} value={item.name || ''} placeholder={"项目名"} />
          </Grid.Column>
          <Grid.Column style={{ flex: 1 }}>
            <input onChange={(event) => this.updateCell(index, 1, event.target.value)} value={item.mark || ''} placeholder={"得分%"} />
          </Grid.Column>
          <Grid.Column style={{ flex: 1 }}>
            <input onChange={(event) => this.updateCell(index, 2, event.target.value)} value={item.portion || ''} placeholder={"占比%"} />
          </Grid.Column>
          <Grid.Column style={{ flex: 1 }}>
            <Button color='red' onClick={() => this.removeItem(index)}>删</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );

    return (
      <Form>
        <Grid>
          <Grid.Row>
            <Grid.Column style={{ flex: 1, textAlign: "center" }}>
              Made by Khalil
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Grid>
          <Grid.Row>
            <Grid.Column style={{ flex: 1 }}>
              项目名
            </Grid.Column>
            <Grid.Column style={{ flex: 1 }}>
              得分%
            </Grid.Column>
            <Grid.Column style={{ flex: 1 }}>
              占比%
            </Grid.Column>
            <Grid.Column style={{ flex: 1 }}>
              操作
            </Grid.Column>
          </Grid.Row>
        </Grid>

        {itemLists}
        <div style={{ marginLeft: 1, marginTop: 16, marginBottom: 16 }}>
          <Button.Group widths='5'>
            <Button color='green' onClick={this.addNewItem}>
              添加项目
          </Button>
          </Button.Group>

        </div>
        <Grid>
          <Grid.Row>
            <Grid.Column style={{ flex: 1, marginTop: 8 }}>
              目标分数
          </Grid.Column>
            <Grid.Column style={{ flex: 4 }}>
              <input value={this.state.expectedGrade} onChange={(event) => this.setState({ expectedGrade: event.target.value })} placeholder={"目标分数"} />
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Grid>
          <Grid.Row>
            <Grid.Column>
              {this.renderResultMessage()}
            </Grid.Column>
          </Grid.Row>
        </Grid>


        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Message>
                <Message.Header>使用说明</Message.Header>
                <Message.Item>得分%：假设你的midterm成绩是8/10, 则在这里填80</Message.Item>
                <Message.Item>占比%：假设你的midterm在syllabus里占20分,则在这里填20</Message.Item>
                <Message.Item>在其中某一个项目里留空，并填写目标分数，系统将自动计算出此项目需要达到的分数(%)</Message.Item>
              </Message>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>


    );
  }
}

export default GradeForm;
