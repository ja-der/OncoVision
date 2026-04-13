import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, AlertCircle, CheckCircle, ImageIcon, Loader2 } from 'lucide-react';

interface PredictionData {
  prediction: string;
  confidence: number;
  model_version: string;
  inference_time_ms: number;
  heatmap: string | null;
}

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState<PredictionData | null>(null);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG or JPG).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    setError('');
    setSelectedFile(file);
    setData(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const runAnalysis = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError('');
    setData(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to get prediction");
      }

      const result: PredictionData = await response.json();
      setData(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const confidencePercentage = data ? Math.round(data.confidence * 100) : 0;
  const isMalignant = data?.prediction === "Malignant";

  return (
    <div className="size-full flex flex-col min-h-screen" style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f8fafb' }}>
      {/* Top Bar */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e1e8ed',
        padding: '0'
      }}>
        <div className="px-12 py-5 flex items-center">
          <div style={{
            width: '4px',
            height: '28px',
            background: 'linear-gradient(180deg, #4a90a4 0%, #7ba7b8 100%)',
            marginRight: '16px'
          }} />
          <h1 style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '22px',
            fontWeight: 700,
            color: '#1a2b3c',
            letterSpacing: '-0.02em'
          }}>
            OncoVision
          </h1>
          <div style={{
            marginLeft: '12px',
            paddingLeft: '12px',
            borderLeft: '1px solid #e1e8ed',
            fontSize: '13px',
            color: '#64758b',
            fontWeight: 500
          }}>
            AI Dermatology Analysis
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-2">
          {/* Left Panel - Upload */}
          <div className="h-full flex flex-col" style={{
            backgroundColor: '#ffffff'
          }}>
            <div style={{
              padding: '32px 48px',
              borderBottom: '1px solid #e1e8ed',
              height: '180px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              backgroundColor: '#ffffff'
            }}>
              <div style={{
                display: 'inline-block',
                padding: '6px 12px',
                backgroundColor: '#e8f2f5',
                marginBottom: '12px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#4a90a4',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>
                Input
              </div>
              <h2 style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                color: '#1a2b3c',
                marginBottom: '8px',
                letterSpacing: '-0.01em'
              }}>
                Upload Lesion Image
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#64758b',
                lineHeight: '1.6'
              }}>
                Provide a high-quality photograph for diagnostic analysis
              </p>
            </div>

            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '48px'
            }}>

              <div className="w-full max-w-md space-y-5">
                {/* Upload Zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={handleClick}
                  className="cursor-pointer transition-all aspect-square flex items-center justify-center relative overflow-hidden"
                  style={{
                    border: isDragging ? '2px solid #4a90a4' : (previewUrl ? '2px solid #d1dce2' : '2px dashed #d1dce2'),
                    backgroundColor: isDragging ? '#f0f7f9' : '#fafbfc'
                  }}
                >
                  {previewUrl ? (
                    <>
                      <img
                        src={previewUrl}
                        alt="Selected lesion"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-0 right-0 px-3 py-2" style={{
                        backgroundColor: '#e8f5e9',
                        // borderBottomLeft: '1px solid #c8e6c9'
                      }}>
                        <CheckCircle size={18} style={{ color: '#4caf50' }} strokeWidth={2.5} />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-5 p-12 text-center">
                      <div style={{
                        width: '56px',
                        height: '56px',
                        border: '2px solid #d1dce2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Upload size={28} style={{ color: '#8696a6' }} strokeWidth={2} />
                      </div>
                      <div>
                        <p style={{
                          fontSize: '15px',
                          fontWeight: 600,
                          color: '#1a2b3c',
                          marginBottom: '8px'
                        }}>
                          Select or drop image file
                        </p>
                        <p style={{
                          fontSize: '13px',
                          color: '#8696a6',
                          letterSpacing: '0.01em'
                        }}>
                          PNG, JPG · Maximum 5MB
                        </p>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleInputChange}
                    className="hidden"
                  />
                </div>

                {/* CTA Button */}
                <button
                  onClick={runAnalysis}
                  disabled={!selectedFile || isAnalyzing}
                  className="w-full transition-all flex items-center justify-center gap-2.5"
                  style={{
                    padding: '16px 24px',
                    backgroundColor: selectedFile && !isAnalyzing ? '#4a90a4' : '#e1e8ed',
                    color: selectedFile && !isAnalyzing ? '#ffffff' : '#8696a6',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: selectedFile && !isAnalyzing ? 'pointer' : 'not-allowed',
                    letterSpacing: '-0.01em',
                    border: 'none'
                  }}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Processing Analysis
                    </>
                  ) : (
                    'Run Analysis'
                  )}
                </button>

                {/* Error State */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 flex items-start gap-3"
                      style={{
                        backgroundColor: '#fff4f4',
                        borderLeft: '3px solid #ef5350'
                      }}
                    >
                      <AlertCircle size={18} style={{ color: '#ef5350', flexShrink: 0, marginTop: '2px' }} strokeWidth={2.5} />
                      <p style={{
                        fontSize: '14px',
                        color: '#c62828',
                        lineHeight: '1.6',
                        fontWeight: 500
                      }}>
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="h-full flex flex-col" style={{
            backgroundColor: '#ffffff',
            borderLeft: '1px solid #e1e8ed'
          }}>
            <div style={{
              padding: '32px 48px',
              borderBottom: '1px solid #e1e8ed',
              backgroundColor: '#ffffff',
              height: '180px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{
                display: 'inline-block',
                padding: '6px 12px',
                backgroundColor: '#fff4e6',
                marginBottom: '12px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#f57c00',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>
                Output
              </div>
              <h2 style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                color: '#1a2b3c',
                marginBottom: '8px',
                letterSpacing: '-0.01em'
              }}>
                Diagnostic Results
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#64758b',
                lineHeight: '1.6'
              }}>
                AI-generated classification and confidence metrics
              </p>
            </div>

            {/* Output Content */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '48px',
              overflowY: 'auto',
              backgroundColor: '#f5f7f9'
            }}>
              <div className="w-full max-w-lg">
                {!data && !isAnalyzing && (
                  // Empty State
                  <div
                    className="border-2 border-dashed aspect-square flex flex-col items-center justify-center gap-4"
                    style={{
                      borderColor: '#d1dce2',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <div style={{
                      width: '56px',
                      height: '56px',
                      border: '2px solid #d1dce2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ImageIcon size={28} style={{ color: '#c1cdd7' }} strokeWidth={2} />
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: '#8696a6',
                      fontWeight: 500
                    }}>
                      Awaiting image input
                    </p>
                  </div>
                )}

                {isAnalyzing && (
                  // Loading State
                  <div className="space-y-6">
                    <div style={{
                      padding: '24px',
                      backgroundColor: '#ffffff',
                      borderLeft: '3px solid #4a90a4'
                    }}>
                      <div className="flex items-center gap-3 mb-5">
                        <Loader2 size={24} className="animate-spin" style={{ color: '#4a90a4' }} strokeWidth={2.5} />
                        <span style={{
                          fontSize: '16px',
                          fontWeight: 600,
                          color: '#1a2b3c'
                        }}>
                          Analyzing image data...
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div className="h-2 animate-pulse" style={{
                          background: 'linear-gradient(90deg, #4a90a4 0%, #7ba7b8 100%)',
                          opacity: 0.3,
                          width: '70%'
                        }} />
                        <div className="h-2 animate-pulse" style={{
                          background: 'linear-gradient(90deg, #4a90a4 0%, #7ba7b8 100%)',
                          opacity: 0.2,
                          width: '50%'
                        }} />
                      </div>
                    </div>
                    <div className="aspect-square animate-pulse" style={{
                      backgroundColor: '#ffffff',
                      border: '2px solid #e1e8ed'
                    }} />
                  </div>
                )}

                {data && (
                  // Result State
                  <div className="space-y-6 pb-12">
                    {/* Classification */}
                    <div style={{
                      backgroundColor: '#ffffff',
                      borderLeft: `4px solid ${isMalignant ? '#ef5350' : '#66bb6a'}`,
                      padding: '28px 32px'
                    }}>
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <div style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            backgroundColor: isMalignant ? '#ffebee' : '#e8f5e9',
                            marginBottom: '12px',
                            fontSize: '10px',
                            fontWeight: 700,
                            color: isMalignant ? '#ef5350' : '#66bb6a',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase'
                          }}>
                            Classification
                          </div>
                          <h3 style={{
                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                            fontSize: '42px',
                            fontWeight: 800,
                            color: isMalignant ? '#ef5350' : '#66bb6a',
                            lineHeight: 1,
                            letterSpacing: '-0.03em'
                          }}>
                            {data.prediction}
                          </h3>
                        </div>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: isMalignant ? '#ffebee' : '#e8f5e9'
                        }}>
                          {!isMalignant ? (
                            <CheckCircle size={28} style={{ color: '#66bb6a' }} strokeWidth={2.5} />
                          ) : (
                            <AlertCircle size={28} style={{ color: '#ef5350' }} strokeWidth={2.5} />
                          )}
                        </div>
                      </div>

                      {/* Confidence */}
                      <div>
                        <div className="flex items-baseline justify-between mb-3">
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#8696a6',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em'
                          }}>
                            Confidence Score
                          </span>
                          <span style={{
                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                            fontSize: '28px',
                            fontWeight: 800,
                            color: isMalignant ? '#ef5350' : '#66bb6a',
                            letterSpacing: '-0.02em'
                          }}>
                            {confidencePercentage}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative h-1.5 overflow-hidden" style={{
                          backgroundColor: '#e1e8ed'
                        }}>
                          <motion.div
                            className="h-full transition-all"
                            initial={{ width: 0 }}
                            animate={{ width: `${confidencePercentage}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            style={{
                              background: isMalignant
                                ? 'linear-gradient(90deg, #ef5350 0%, #e57373 100%)'
                                : 'linear-gradient(90deg, #66bb6a 0%, #81c784 100%)'
                            }}
                          />
                          {/* Threshold Line at 70% */}
                          <div className="absolute top-0 left-[70%] h-full w-0.5 bg-yellow-600/50" />
                        </div>

                        <p style={{
                          fontSize: '13px',
                          color: '#64758b',
                          marginTop: '16px',
                          fontWeight: 500,
                          lineHeight: '1.6'
                        }}>
                          {confidencePercentage >= 70
                            ? '→ High confidence result. Consult a dermatologist for professional evaluation.'
                            : '→ Low confidence detected. Clinical review strongly recommended.'}
                        </p>
                      </div>
                    </div>

                    {/* Heatmap */}
                    {data.heatmap && (
                      <div>
                        <div style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          backgroundColor: '#fff4e6',
                          marginBottom: '16px',
                          fontSize: '10px',
                          fontWeight: 700,
                          color: '#f57c00',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase'
                        }}>
                          Attention Map
                        </div>
                        <div className="relative overflow-hidden" style={{
                          border: '2px solid #e1e8ed',
                          backgroundColor: '#ffffff'
                        }}>
                          <img
                            src={`data:image/jpeg;base64,${data.heatmap}`}
                            alt="AI attention heatmap"
                            className="w-full aspect-square object-cover"
                          />
                          <div
                            className="absolute bottom-0 left-0 right-0 px-4 py-3"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              borderTop: '1px solid #e1e8ed',
                              fontSize: '11px',
                              fontWeight: 700,
                              color: '#4a90a4',
                              letterSpacing: '0.05em',
                              textTransform: 'uppercase'
                            }}
                          >
                            Grad-CAM Visualization
                          </div>
                        </div>
                        <p style={{
                          fontSize: '13px',
                          color: '#64758b',
                          marginTop: '12px',
                          lineHeight: '1.6',
                          fontWeight: 500
                        }}>
                          → Regions of interest identified by the AI model during analysis
                        </p>
                      </div>
                    )}

                    {/* Metadata */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1px',
                      backgroundColor: '#e1e8ed',
                      border: '1px solid #e1e8ed'
                    }}>
                      <div style={{
                        padding: '20px',
                        backgroundColor: '#ffffff'
                      }}>
                        <p style={{
                          fontSize: '10px',
                          color: '#8696a6',
                          marginBottom: '8px',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase'
                        }}>
                          Pipeline Version
                        </p>
                        <p style={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: '#1a2b3c',
                          fontFamily: 'Plus Jakarta Sans, sans-serif'
                        }}>
                          v{data.model_version}
                        </p>
                      </div>
                      <div style={{
                        padding: '20px',
                        backgroundColor: '#ffffff',
                        textAlign: 'right'
                      }}>
                        <p style={{
                          fontSize: '10px',
                          color: '#8696a6',
                          marginBottom: '8px',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase'
                        }}>
                          Inference Time
                        </p>
                        <p style={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: '#1a2b3c',
                          fontFamily: 'Plus Jakarta Sans, sans-serif'
                        }}>
                          {data.inference_time_ms}ms
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer style={{
        borderTop: '1px solid #e1e8ed',
        backgroundColor: '#ffffff',
        padding: '24px 48px',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="flex items-start gap-3">
          <div style={{
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px'
          }}>
            <AlertCircle size={16} style={{ color: '#f57c00' }} strokeWidth={2.5} />
          </div>
          <p style={{
            fontSize: '12px',
            color: '#64758b',
            lineHeight: '1.7',
            fontWeight: 500
          }}>
            <strong style={{ color: '#1a2b3c', fontWeight: 700 }}>Medical Disclaimer:</strong> This tool is for educational and research purposes only. It is not a substitute for professional medical diagnosis. Always consult a qualified dermatologist for proper evaluation and treatment recommendations.
          </p>
        </div>
      </footer>
    </div>
  );
}
