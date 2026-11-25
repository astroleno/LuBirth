import { Component } from 'react';
import type { ReactNode } from 'react';

export class ViewBoundary extends Component<{ children: ReactNode; earth: boolean; onBack: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }

  render() {
    if (!this.state.failed) return this.props.children;
    return <div className="journey-loading" role="alert"><div>
      <p>画面未能载入，观察信息仍保留。</p>
      <button className="journey-secondary" onClick={this.props.onBack}>{this.props.earth ? '重新加载' : '返回地月'}</button>
    </div></div>;
  }
}
