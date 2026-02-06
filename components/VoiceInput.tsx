
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { parseVoiceCommand } from '../services/geminiService';
import { FinancialData } from '../types';

interface VoiceInputProps {
  onDataParsed: (data: Partial<FinancialData>) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onDataParsed }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'ar-SA';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = async (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);
        setIsProcessing(true);
        
        const parsed = await parseVoiceCommand(text);
        onDataParsed(parsed);
        setIsProcessing(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech Recognition Error", event.error);
        setIsListening(false);
      };
    }
  }, [onDataParsed]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-emerald-100">
      <button
        onClick={toggleListening}
        disabled={isProcessing}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
          isListening 
            ? 'bg-red-500 animate-pulse text-white shadow-lg shadow-red-200' 
            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200'
        } disabled:opacity-50`}
      >
        {isProcessing ? <Loader2 className="w-8 h-8 animate-spin" /> : (isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />)}
      </button>
      <div className="text-center">
        <p className="font-semibold text-slate-700">
          {isProcessing ? 'جاري تحليل البيانات...' : isListening ? 'جاري الاستماع...' : 'اضغط للتحدث (مثال: المخزون ٥٠ مليون)'}
        </p>
        {transcript && <p className="text-sm text-slate-500 mt-1 italic">"{transcript}"</p>}
      </div>
    </div>
  );
};

export default VoiceInput;
