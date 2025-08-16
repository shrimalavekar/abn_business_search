'use client'

import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Search, Filter, BarChart3 } from 'lucide-react';
import { supabase } from '../../../supabaseClient';
import toast from 'react-hot-toast';
import { NextResponse } from 'next/server';

type AuthMode = 'login' | 'signup';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Redirect to home page after successful login
        toast.success('Login successful');

        window.location.href = '/home';
        // const redirectUrl = new URL('/home', window.location.origin);
        //  NextResponse.redirect(redirectUrl);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (name: string, email: string, password: string, confirmPassword: string) => {
    setIsLoading(true);
    try {
      // Sign up with Supabase (email confirmation disabled)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Since we're not requiring email confirmation, we can sign in immediately
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw signInError;
        }

        // Redirect to login page after successful signup
        setMode('login');
        toast.success('Account created successfully! Please sign in.');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex">
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-12">
        <div className="max-w-md mx-auto flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <Building2 className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Business Data Search</h1>
            </div>
            <p className="text-xl text-blue-100 mb-8">
              Access comprehensive business data with advanced search and filtering capabilities
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Search className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Advanced Search</h3>
                <p className="text-blue-100">
                  Search through thousands of business records with intelligent filtering
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Filter className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Smart Filters</h3>
                <p className="text-blue-100">
                  Filter by location, company type, status, and more with real-time results
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Data Analytics</h3>
                <p className="text-blue-100">
                  Get insights and analytics on business data with interactive dashboards
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-white/10 rounded-lg">
            <p className="text-sm text-blue-100">
              &ldquo;This platform has revolutionized how we access and analyze business data. 
              The search capabilities are incredibly powerful and user-friendly.&rdquo;
            </p>
            <p className="text-sm font-semibold mt-2">- Business Analyst</p>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold">Business Data Search</h1>
            </div>
            <p className="text-muted-foreground">
              Access comprehensive business data with advanced search capabilities
            </p>
          </div>

          {/* Auth Form */}
          {mode === 'login' ? (
            <LoginForm
              onLogin={handleLogin}
              onSwitchToSignup={() => setMode('signup')}
              isLoading={isLoading}
            />
          ) : (
            <SignupForm
              onSignup={handleSignup}
              onSwitchToLogin={() => setMode('login')}
              isLoading={isLoading}
            />
          )}

          {/* Info */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Supabase Authentication:</strong> Sign up with your email and password.
                <br />
                Email verification is disabled for this demo.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
