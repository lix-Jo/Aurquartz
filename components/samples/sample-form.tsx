function VoiceRecorder({ 
  recordings, 
  onAddRecording, 
  onDeleteRecording 
}: { 
  recordings: VoiceRecording[]
  onAddRecording: (recording: VoiceRecording) => void
  onDeleteRecording: (id: string) => void
}) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [playingId, setPlayingId] = useState<string | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  const mimeTypeRef = useRef<string>('audio/webm')

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      let options = {}
      if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeTypeRef.current = 'audio/webm'
        options = { mimeType: 'audio/webm' }
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeTypeRef.current = 'audio/mp4'
        options = { mimeType: 'audio/mp4' }
      } else if (MediaRecorder.isTypeSupported('audio/aac')) {
        mimeTypeRef.current = 'audio/aac'
        options = { mimeType: 'audio/aac' }
      } else {
        mimeTypeRef.current = ''
      }

      const mediaRecorder = new MediaRecorder(stream, options)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeTypeRef.current || 'audio/mp4' })
        const audioUrl = URL.createObjectURL(audioBlob)
        
        if (audioChunksRef.current.length === 0 || audioBlob.size === 0) {
          console.error('[Aurquartz Error] لم يتم التقاط أي بيانات صوتية من الميكروفون.')
          return
        }

        const newRecording: VoiceRecording = {
          id: `rec-${Date.now()}`,
          audioUrl,
          duration: recordingTime,
          createdAt: new Date().toISOString()
        }
        
        onAddRecording(newRecording)
        setRecordingTime(0)
        
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start(1000)
      setIsRecording(true)
            timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('[Aurquartz] Error accessing microphone:', error)
      alert('Unable to access microphone. Please enable microphone permissions in your Apple settings.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const togglePlayback = (recording: VoiceRecording) => {
    if (playingId === recording.id) {
      audioRef.current?.pause()
      setPlayingId(null)
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      audioRef.current = new Audio(recording.audioUrl)
      audioRef.current.onended = () => setPlayingId(null)
      audioRef.current.play().catch(err => {
        console.error('[Aurquartz] Playback error:', err)
      })
      setPlayingId(recording.id)
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      {/* عناصر التحكم بالتسجيل */}
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        {!isRecording ? (
          <Button 
            type="button" 
            onClick={startRecording}
            variant="default"
            className="gap-2"
          >
            <Mic className="w-4 h-4" />
            Start Recording
          </Button>
        ) : (
          <>
            <Button 
              type="button" 
              onClick={stopRecording}
              variant="destructive"
              className="gap-2"
            >
              <Square className="w-4 h-4" />
              Stop
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono text-sm">{formatTime(recordingTime)}</span>
            </div>
          </>
        )}
      </div>

      {/* قائمة الصوتيات المسجلة */}
      {recordings.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Saved Recordings</p>
          {recordings.map((recording) => (
            <motion.div
              key={recording.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => togglePlayback(recording)}
                  className="h-8 w-8"
                >
                  {playingId === recording.id ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
                <div className="flex items-center gap-2">
                  <FileAudio className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Recording {new Date(recording.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(recording.duration)}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteRecording(recording.id)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
