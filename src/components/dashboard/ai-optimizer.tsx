'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bot, Sparkles, Loader2, Lightbulb } from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { suggestOptimalWorkspace } from '@/ai/flows/suggest-optimal-workspace';
import type { SuggestOptimalWorkspaceOutput } from '@/ai/flows/suggest-optimal-workspace';
import { useToast } from '@/hooks/use-toast';

const optimizerSchema = z.object({
  timeOfDay: z.string().min(1, 'Please select a time of day.'),
  dayOfWeek: z.string().min(1, 'Please select a day of the week.'),
  workspacePreferences: z.string().optional(),
});

type OptimizerFormValues = z.infer<typeof optimizerSchema>;

export function AiOptimizer() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestOptimalWorkspaceOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<OptimizerFormValues>({
    resolver: zodResolver(optimizerSchema),
    defaultValues: {
      timeOfDay: 'afternoon',
      dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
      workspacePreferences: 'a quiet area for focused work',
    }
  });

  const onSubmit = async (data: OptimizerFormValues) => {
    setIsLoading(true);
    setSuggestion(null);
    try {
      const result = await suggestOptimalWorkspace(data);
      setSuggestion(result);
    } catch (error) {
      console.error('AI Optimizer Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get a suggestion. Please try again.',
      });
    }
    setIsLoading(false);
  };

  return (
    <Card className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot />
          <span>AI Workspace Optimizer</span>
        </CardTitle>
        <CardDescription className="text-primary-foreground/80">
          Find the best spot to maximize your focus and productivity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="timeOfDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time of Day</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="morning">Morning (9am - 12pm)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (1pm - 5pm)</SelectItem>
                      <SelectItem value="evening">Evening (6pm - 9pm)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dayOfWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day of Week</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                        <SelectValue placeholder="Select a day" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                            <SelectItem key={day} value={day}>{day}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workspacePreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Needs</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., quiet, near a window" {...field} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Get Suggestion
            </Button>
          </form>
        </Form>
      </CardContent>
      {suggestion && (
        <CardFooter className="flex flex-col items-start gap-4 rounded-b-lg bg-black/20 p-4">
           <h4 className="font-semibold flex items-center gap-2"><Lightbulb className="text-yellow-300"/> Suggested Workspace:</h4>
           <p className="font-bold text-lg text-yellow-300">{suggestion.suggestedWorkspace}</p>
           <h4 className="font-semibold mt-2">Reasoning:</h4>
           <p className="text-sm text-primary-foreground/80">{suggestion.reasoning}</p>
        </CardFooter>
      )}
    </Card>
  );
}
