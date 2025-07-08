import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Flame, Zap, Bot, Plus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { defaultPrompts } from '@shared/schema';
import type { Prompt } from '@shared/schema';

export default function Home() {
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();

  const { data: prompts, isLoading } = useQuery({
    queryKey: ['/api/prompts'],
    queryFn: () => apiRequest('/api/prompts'),
  });

  const createPromptMutation = useMutation({
    mutationFn: (prompt: { text: string; category?: string }) =>
      apiRequest('/api/prompts', {
        method: 'POST',
        body: JSON.stringify(prompt),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prompts'] });
      setCustomPrompt('');
      setShowCustomPrompt(false);
      toast({
        title: '🔥 Prompt added!',
        description: 'Your custom prompt is ready to roast some AIs.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to add prompt. Please try again.',
      });
    },
  });

  const handleAddPrompt = () => {
    if (customPrompt.trim()) {
      createPromptMutation.mutate({
        text: customPrompt.trim(),
        category: 'custom',
      });
    }
  };

  const handleQuickAdd = (prompt: { text: string; category: string }) => {
    createPromptMutation.mutate(prompt);
  };

  const categories = ['all', 'humor', 'educational', 'creative', 'social', 'custom'];
  const filteredPrompts = prompts?.filter((prompt: Prompt) => 
    selectedCategory === 'all' || prompt.category === selectedCategory
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="roast-title text-6xl font-bold mb-4 flex items-center justify-center gap-4">
            <Flame className="text-orange-500" size={64} />
            Prompt Roast
            <Flame className="text-orange-500" size={64} />
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Where AI responses go to get absolutely roasted 🔥
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'fire' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </header>

        {/* Quick Add Default Prompts */}
        {(!prompts || prompts.length === 0) && (
          <Card className="mb-8 border-dashed border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="text-yellow-500" />
                Quick Start Prompts
              </CardTitle>
              <CardDescription>
                Get started with these fire prompts that are guaranteed to roast AIs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {defaultPrompts.map((prompt, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
                    onClick={() => handleQuickAdd(prompt)}
                  >
                    <p className="text-sm font-medium mb-2 group-hover:text-primary">
                      {prompt.text}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground capitalize">
                        {prompt.category}
                      </span>
                      <Plus className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Custom Prompt */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="text-green-500" />
              {showCustomPrompt ? 'Create Custom Prompt' : 'Add Your Own Roast'}
            </CardTitle>
            <CardDescription>
              {showCustomPrompt 
                ? 'Create a prompt that will make AIs question their existence'
                : 'Got a spicy prompt? Add it and watch the AIs struggle!'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showCustomPrompt ? (
              <div className="space-y-4">
                <Textarea
                  placeholder="Enter your brutal prompt here..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddPrompt}
                    disabled={!customPrompt.trim() || createPromptMutation.isPending}
                    variant="fire"
                  >
                    {createPromptMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Flame className="mr-2 h-4 w-4" />
                    )}
                    Add Prompt
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCustomPrompt(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setShowCustomPrompt(true)}
                variant="fire"
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Custom Prompt
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Prompts List */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading prompts...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((prompt: Prompt) => (
              <Card key={prompt.id} className="hover:shadow-lg transition-shadow group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardDescription className="text-xs uppercase tracking-wider mb-2 text-muted-foreground">
                        {prompt.category || 'General'}
                      </CardDescription>
                      <CardTitle className="text-lg leading-tight">
                        {prompt.text}
                      </CardTitle>
                    </div>
                    <Bot className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href={`/prompt/${prompt.id}`}>
                    <Button variant="fire" className="w-full group-hover:scale-105 transition-transform">
                      <Flame className="mr-2 h-4 w-4" />
                      Start Roasting
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 p-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Powered by sarcasm and questionable AI decisions
          </p>
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            <span>🔥 Roast responsibly</span>
            <span>•</span>
            <span>🤖 No AIs were harmed in the making of this site</span>
            <span>•</span>
            <span>💸 Affiliate links may be present</span>
          </div>
        </footer>
      </div>
    </div>
  );
}