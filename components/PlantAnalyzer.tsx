import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Leaf, AlertCircle } from 'lucide-react';
import { identifyPlant } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';

const PlantAnalyzer: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size too large. Please choose an image under 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Extract base64 data and mime type
        // Data URL format: data:[<mediatype>][;base64],<data>
        const matches = base64String.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          setMimeType(matches[1]);
          // We keep the full data URL for preview, pass the raw base64 to API
          setSelectedImage(base64String); 
          setResult(null);
          setError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !mimeType) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Remove the header from base64 string for the API
      const base64Data = selectedImage.split(',')[1];
      const analysisText = await identifyPlant(base64Data, mimeType);
      setResult(analysisText);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 pb-24">
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-stone-100 bg-emerald-50/50">
          <h2 className="text-xl font-semibold text-emerald-900 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-600" />
            Plant Identification
          </h2>
          <p className="text-emerald-700/80 text-sm mt-1">
            Upload a photo of a plant to get identification details and care tips.
          </p>
        </div>

        <div className="p-6">
          {/* Upload Area */}
          {!selectedImage ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-300 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all group"
            >
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-white group-hover:scale-110 transition-transform shadow-sm">
                <Upload className="w-8 h-8 text-stone-400 group-hover:text-emerald-500" />
              </div>
              <p className="text-stone-600 font-medium">Click to upload a photo</p>
              <p className="text-stone-400 text-sm mt-1">JPG, PNG, WEBP (Max 5MB)</p>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-50">
              <img 
                src={selectedImage} 
                alt="Selected plant" 
                className="w-full max-h-96 object-contain"
              />
              <button 
                onClick={clearImage}
                className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-red-50 text-stone-600 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />

          {/* Actions */}
          {selectedImage && !result && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={`
                  flex items-center gap-2 px-8 py-3 rounded-full font-medium text-white shadow-lg shadow-emerald-200
                  transition-all transform hover:-translate-y-0.5
                  ${isAnalyzing ? 'bg-stone-400 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700'}
                `}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Plant...
                  </>
                ) : (
                  <>
                    <Leaf className="w-5 h-5" />
                    Analyze Photo
                  </>
                )}
              </button>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="prose prose-emerald max-w-none">
                <MarkdownRenderer content={result} />
              </div>
              <div className="mt-8 pt-6 border-t border-stone-100 flex justify-center">
                <button 
                  onClick={clearImage}
                  className="text-stone-500 hover:text-emerald-600 text-sm font-medium underline-offset-4 hover:underline transition-colors"
                >
                  Analyze another plant
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantAnalyzer;
