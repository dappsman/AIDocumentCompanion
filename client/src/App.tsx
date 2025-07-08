import { Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import Home from '@/pages/Home';
import PromptDetail from '@/pages/PromptDetail';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/prompt/:id" component={PromptDetail} />
          </Switch>
          <Toaster />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}