import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const palette = {
  background: "#130914",
  surface: "#191222",
  surfaceBorder: "rgba(255, 255, 255, 0.08)",
  textPrimary: "#f4ecff",
  textSecondary: "#c7b9d6",
  accent: "#ff6ce0",
};

type Props = {
  children: ReactNode;
};

type State = {
  error: Error | null;
};

/**
 * Catches render-time exceptions anywhere below it in the tree (e.g. a
 * malformed entry from a data merge/scrape) and shows a recovery screen
 * instead of leaving the app on a blank/crashed native screen with no way
 * back in.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // No crash-reporting service is wired up yet; at minimum, surface it in
    // dev tooling so it isn't silently swallowed.
    if (__DEV__) {
      console.error("Unhandled render error:", error, errorInfo.componentStack);
    }
  }

  handleRetry = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.message}>
              This screen hit an unexpected error and couldn't finish
              rendering. Your data hasn't been affected.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={this.handleRetry}
              accessibilityRole="button"
              accessibilityLabel="Try again"
            >
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.surfaceBorder,
    padding: 24,
    maxWidth: 360,
    width: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: palette.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: palette.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: palette.accent,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "700",
    color: palette.background,
  },
});
