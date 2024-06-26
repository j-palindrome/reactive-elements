import {
  ChildComponent,
  FrameComponent,
  defineChildComponent
} from '../blocks/FrameChildComponents'
import { omit } from 'lodash'
import { ChildProps, ParentProps } from '../types'

const AudioCtx = (
  props: ParentProps<
    ConstructorParameters<typeof AudioContext>[0],
    AudioContext
  >
) => (
  <FrameComponent
    options={omit(props, 'children')}
    getSelf={(
      options?: ConstructorParameters<typeof AudioContext>[0] | undefined
    ) => new AudioContext(options)}>
    {props.children}
  </FrameComponent>
)

export default AudioCtx

export const MicInput = (
  props: ChildProps<
    {},
    {
      input: MediaStreamAudioSourceNode
      gain: GainNode
      compressor: DynamicsCompressorNode
    },
    AudioContext
  >
) => (
  <ChildComponent
    options={props}
    getSelf={async (options, context) => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      })
      const input = context.createMediaStreamSource(stream)
      const gain = context.createGain()
      const compressor = context.createDynamicsCompressor()
      input.connect(compressor)
      compressor.connect(gain)
      return { input, gain, compressor }
    }}>
    {props.children}
  </ChildComponent>
)
export const BufferSource = (
  props: ChildProps<
    {
      source?: AudioBufferSourceOptions
      buffer?: AudioBufferOptions
      url?: string
      data?: number[][]
    },
    { source: AudioBufferSourceNode; buffer: AudioBuffer },
    AudioContext
  >
) => (
  <ChildComponent
    options={props}
    getSelf={async (options, context) => {
      let buffer: AudioBuffer
      if (options?.url) {
        const data = await fetch(options.url)
        buffer = await context.decodeAudioData(await data.arrayBuffer())
      } else if (options?.data) {
        buffer = new AudioBuffer({
          length: options.data[0].length,
          numberOfChannels: options.data.length,
          sampleRate: context.sampleRate
        })
        for (let i = 0; i < options.data.length; i++)
          [buffer.copyToChannel(new Float32Array(options.data[i]), i)]
      } else {
        buffer = new AudioBuffer({
          length: 1000,
          numberOfChannels: 1,
          sampleRate: context.sampleRate,
          ...options.buffer
        })
      }
      return {
        source: new AudioBufferSourceNode(context, {
          ...options.source,
          buffer
        }),
        buffer
      }
    }}>
    {props.children}
  </ChildComponent>
)

export const FFT = defineChildComponent((options: {}, ctx: AudioContext) => {
  const node = ctx.createAnalyser()
  const bufferLength = node.frequencyBinCount
  const intData = new Uint8Array(bufferLength)
  const floatData = new Float32Array(bufferLength)

  return { node, intData, floatData }
})
