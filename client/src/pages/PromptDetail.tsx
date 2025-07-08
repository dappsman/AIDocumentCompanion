import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link, useParams } from 'wouter';
import { ArrowLeft, Flame, Star, Bot, Loader2, Zap, ExternalLink } from 'lucide-react';
import { SiOpenai, SiGooglegemini } from 'react-icons/si';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Prompt, AiResponse } from '@shared/schema';

export default function PromptDetail() {
  const { id } = useParams<{ id: string }>();
  const [generatingResponses, setGeneratingResponses] = useState(false);
  const { toast } = useToast();

  const { data: prompt, isLoading: promptLoading } = useQuery({
    queryKey: ['/api/prompts', id],
    queryFn: () => apiRequest(`/api/prompts/${id}`),
    enabled: !!id,
  });

  const { data: responses, isLoading: responsesLoading } = useQuery({
    queryKey: ['/api/prompts', id, 'responses'],
    queryFn: () => apiRequest(`/api/prompts/${id}/responses`),
    enabled: !!id,
  });

  const generateResponsesMutation = useMutation({
    mutationFn: () => apiRequest(`/api/prompts/${id}/generate`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prompts', id, 'responses'] });
      setGeneratingResponses(false);
      toast({
        title: '🔥 Responses generated!',
        description: 'The AIs have been roasted. Check out their responses!',
      });
    },
    onError: () => {
      setGeneratingResponses(false);
      toast({
        title: 'Error',
        description: 'Failed to generate responses. Please try again.',
      });
    },
  });

  const rateResponseMutation = useMutation({
    mutationFn: ({ responseId, rating }: { responseId: number; rating: number }) =>
      apiRequest(`/api/responses/${responseId}/rating`, {
        method: 'PATCH',
        body: JSON.stringify({ rating }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prompts', id, 'responses'] });
      toast({
        title: '⭐ Rating saved!',
        description: 'Your rating has been recorded.',
      });
    },
  });

  const handleGenerateResponses = () => {
    setGeneratingResponses(true);
    generateResponsesMutation.mutate();
  };

  const handleRate = (responseId: string, rating: number) => {
    rateResponseMutation.mutate({ responseId, rating });
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'gpt':
        return <SiOpenai className="h-5 w-5" />;
      case 'claude':
        return <Bot className="h-5 w-5" />;
      case 'gemini':
        return <SiGooglegemini className="h-5 w-5" />;
      default:
        return <Bot className="h-5 w-5" />;
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'gpt':
        return 'ChatGPT';
      case 'claude':
        return 'Claude';
      case 'gemini':
        return 'Gemini';
      default:
        return provider.toUpperCase();
    }
  };

  const getAffiliateLink = (provider: string) => {
    switch (provider) {
      case 'gpt':
        return 'https://openai.com/chatgpt';
      case 'claude':
        return 'https://claude.ai';
      case 'gemini':
        return 'https://gemini.google.com';
      default:
        return '#';
    }
  };

  if (promptLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading prompt...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Prompt Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The prompt you're looking for doesn't exist or has been deleted.
            </p>
            <Link href="/">
              <Button variant="fire">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Prompts
            </Button>
          </Link>
          
          <div className="text-center">
            <h1 className="roast-title text-4xl font-bold mb-4 flex items-center justify-center gap-4">
              <Flame className="text-orange-500" />
              AI Roast Battle
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              Watch AIs struggle with this prompt
            </p>
          </div>
        </header>

        {/* Prompt Card */}
        <Card className="mb-8 border-2 border-orange-500/20">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Zap className="text-yellow-500" />
              The Prompt
            </CardTitle>
            <CardDescription className="text-xs uppercase tracking-wider">
              {prompt.category || 'General'} • Added {new Date(prompt.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <blockquote className="text-lg italic font-medium border-l-4 border-primary pl-4 py-2">
              "{prompt.text}"
            </blockquote>
            
            {(!responses || responses.length === 0) && (
              <div className="mt-6 text-center">
                <p className="text-muted-foreground mb-4">
                  No responses yet. Let's see how the AIs handle this one!
                </p>
                <Button
                  onClick={handleGenerateResponses}
                  disabled={generatingResponses || generateResponsesMutation.isPending}
                  variant="fire"
                  size="lg"
                >
                  {generatingResponses || generateResponsesMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Flame className="mr-2 h-4 w-4" />
                  )}
                  Generate AI Responses
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Responses */}
        {responsesLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading responses...</p>
          </div>
        ) : responses && responses.length > 0 ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">The Roast Results</h2>
              <p className="text-muted-foreground">
                Here's how each AI responded to your prompt
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {responses.map((response: AiResponse) => (
                <Card key={response.id} className={`provider-${response.provider}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getProviderIcon(response.provider)}
                        {getProviderName(response.provider)}
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRate(response.id, star)}
                            className="text-yellow-500 hover:text-yellow-400 transition-colors"
                            disabled={rateResponseMutation.isPending}
                          >
                            <Star
                              className={`h-4 w-4 ${
                                star <= (response.rating || 0) ? 'fill-current' : ''
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm leading-relaxed">{response.response}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {response.rating ? `${response.rating}/5 stars` : 'Not rated'}
                          </span>
                        </div>
                        <a
                          href={getAffiliateLink(response.provider)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                        >
                          Try {getProviderName(response.provider)}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Regenerate Button */}
            <div className="text-center mt-8">
              <Button
                onClick={handleGenerateResponses}
                disabled={generatingResponses || generateResponsesMutation.isPending}
                variant="outline"
              >
                {generatingResponses || generateResponsesMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Flame className="mr-2 h-4 w-4" />
                )}
                Regenerate Responses
              </Button>
            </div>
          </div>
        ) : null}

        {/* Footer */}
        <footer className="text-center mt-16 p-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Rate the responses and help us roast AIs better!
          </p>
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            <span>🔥 Roast responsibly</span>
            <span>•</span>
            <span>⭐ Your ratings matter</span>
            <span>•</span>
            <span>💸 Affiliate links help keep the lights on</span>
          </div>
        </footer>
      </div>
    </div>
  );
}