import animate from 'animate.css';

export class StepWizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
  }
  animateSteps(change) {
    let active = this.state.step;
    let next = this.state.step + change;
    // console.log(change, active, next);
    let styles = this.props.transitions || {
      enterRight: animate.animated+' '+animate.fadeInRight,
      enterLeft : animate.animated+' '+animate.fadeInLeft,
      exitRight : animate.animated+' '+animate.fadeOutRight,
      exitLeft  : animate.animated+' '+animate.fadeOutLeft
    }
    let classes = this.state.classes;
    if(active < next) {
      // slide left
      classes[active] = styles.exitLeft,
      classes[next] = styles.enterRight
    } else {
      // slide right
      classes[active] = styles.exitRight,
      classes[next] = styles.enterLeft
    }
    this.setState(classes);
  }
  firstStep() {
    this.goToStep(1);
  }
  goToStep(step) {
    step--;
    let current = this.state.step;
    let change = (step - current);
    let action = (change > 0) ? this.nextStep.bind(this) : this.previousStep.bind(this);
    // console.log(current, step, change, Math.abs(change));
    let pause = 0;
    for(let i = 0; i < Math.abs(change); i++) {
      setTimeout(function(){
        action();
      },pause);
      pause += 5;
    }
  }
  initialState() {
    let state = {
      step: 0, classes: {}
    }

    // Set initial classes
    for(let i = 0; i < this.props.children.length; i++) {
      if(this.props.children[i].props.active) {
        state.step = i;
        continue;
      }
      state.classes[i] = 'hide';
    }
    state.classes[state.step] = 'active';

    return state;
  }
  lastStep() {
    this.goToStep(this.props.children.length);
  }
  nextStep() {
    this.animateSteps(1);
    this.setState({ step: this.state.step + 1 },() => {
      this.updateHash();
    });
  }
  previousStep() {
    this.animateSteps(-1);
    this.setState({ step: this.state.step - 1 },() => {
      this.updateHash();
    });
  }
  updateHash() {
    // window.location.hash = 'step'+this.state.step;
  }
  render() {
    let props = {
      currentStep: this.state.step + 1,
      totalSteps: this.props.children.length,

      nextStep: this.nextStep.bind(this),
      previousStep: this.previousStep.bind(this),
      goToStep: this.goToStep.bind(this),
      firstStep: this.firstStep.bind(this),
      lastStep: this.lastStep.bind(this),
    }
    let classes = this.state.classes;

    var childrenWithProps = React.Children.map(this.props.children, (child, i) => {
        props.animate = classes[i];
        return React.cloneElement(child, props);
    });

    return (
      <div className='step-wizard'>
        {childrenWithProps}
      </div>
    );
  }
}

export class Step extends React.Component {
  render() {
    let content = React.cloneElement(this.props.children, this.props);
    return (
      <div className={'step '+this.props.animate}>
        {content}
      </div>
    );
  }
}