import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <main role="alert" className="grid min-h-screen place-items-center bg-ink px-5 text-white"><section className="glass w-full max-w-lg space-y-4 rounded-2xl p-7 text-center"><h1 className="font-display text-2xl font-semibold">Something went wrong</h1><p className="text-sm text-white/70">Notes Keeper hit an unexpected problem. Reload the page to continue.</p><button type="button" onClick={() => window.location.reload()} className="min-h-11 rounded-xl bg-violet px-5 py-2.5 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber focus-visible:ring-offset-2 focus-visible:ring-offset-ink">Reload Notes Keeper</button></section></main>;
    }
    return this.props.children;
  }
}
