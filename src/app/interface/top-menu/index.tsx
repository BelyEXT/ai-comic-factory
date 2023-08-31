"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { FontName, defaultFont, fontList, fonts } from "@/lib/fonts"
import { Input } from "@/components/ui/input"
import { PresetName, defaultPreset, getPreset, getRandomPreset, presets } from "@/app/engine/presets"
import { useStore } from "@/app/store"
import { Button } from "@/components/ui/button"
import { LayoutName, allLayoutLabels, allLayouts, defaultLayout } from "@/app/layouts"

import layoutPreview0 from "../../../../public/layouts/layout0.jpg"
import layoutPreview1 from "../../../../public/layouts/layout1.jpg"
import layoutPreview2 from "../../../../public/layouts/layout2.jpg"
import layoutPreview3 from "../../../../public/layouts/layout3.jpg"
import { StaticImageData } from "next/image"

const layoutIcons: Partial<Record<LayoutName, StaticImageData>> = {
  Layout0: layoutPreview0,
  Layout1: layoutPreview1,
  Layout2: layoutPreview2,
  Layout3: layoutPreview3
}

export function TopMenu() {
   // const font = useStore(state => state.font)
  // const setFont = useStore(state => state.setFont)
  const preset = useStore(state => state.preset)
  const prompt = useStore(state => state.prompt)
  const layout = useStore(state => state.layout)
  const setLayout = useStore(state => state.setLayout)

  const generate = useStore(state => state.generate)

  const isGeneratingStory = useStore(state => state.isGeneratingStory)
  const atLeastOnePanelIsBusy = useStore(state => state.atLeastOnePanelIsBusy)
  const isBusy = isGeneratingStory || atLeastOnePanelIsBusy

  const searchParams = useSearchParams()

  const requestedPreset = (searchParams.get('preset') as PresetName) || defaultPreset
  const requestedFont = (searchParams.get('font') as FontName) || defaultFont
  const requestedPrompt = (searchParams.get('prompt') as string) || ""
  const requestedLayout = (searchParams.get('prompt') as LayoutName) || defaultLayout

  const [draftPrompt, setDraftPrompt] = useState(requestedPrompt)
  const [draftPreset, setDraftPreset] = useState<PresetName>(requestedPreset)
  const [draftLayout, setDraftLayout] = useState<LayoutName>(requestedLayout)

  const handleSubmit = () => {
    const promptChanged = draftPrompt.trim() !== prompt.trim()
    const presetChanged = draftPreset !== preset.id
    const layoutChanged = draftLayout !== layout
    if (!isBusy && (promptChanged || presetChanged || layoutChanged)) {
      generate(draftPrompt, draftPreset, draftLayout)
    }
  }

  useEffect(() => {
    const layoutChanged = draftLayout !== layout
    if (layoutChanged && !isBusy) {
      setLayout(draftLayout)
    }
  }, [layout, draftLayout, isBusy])
    
  return (
    <div className={cn(
      `print:hidden`,
      `z-10 fixed top-0 left-0 right-0`,
      `flex flex-col md:flex-row w-full justify-between items-center`,
      `backdrop-blur-xl`,
      `transition-all duration-200 ease-in-out`,
      `px-2 py-2 border-b-1 border-gray-50 dark:border-gray-50`,
      `bg-stone-900/70 dark:bg-stone-900/70 text-gray-50 dark:text-gray-50`,
      `space-y-2 md:space-y-0 md:space-x-3 lg:space-x-6`
    )}>
      <div className="flex flex-row space-x-6 md:space-x-3">
      <div className={cn(
          `transition-all duration-200 ease-in-out`,
          `flex flex-row items-center justify-start space-x-3 font-mono w-1/2 md:w-auto`
          )}>

          {/* <Label className="flex text-xs md:text-sm md:w-24">Style:</Label> */}

          <Select
            defaultValue={defaultPreset}
            onValueChange={(value) => { setDraftPreset(value as PresetName) }}
            disabled={isBusy}
            >
            <SelectTrigger className="flex-grow">
              <SelectValue className="text-xs md:text-sm" placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(presets).map(([key, preset]) =>
                <SelectItem key={key} value={key}>{preset.label}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className={cn(
          `transition-all duration-200 ease-in-out`,
          `flex flex-row items-center justify-start space-x-3 font-mono w-1/2 md:w-auto`
          )}>

          {/* <Label className="flex text-xs md:text-sm md:w-24">Style:</Label> */}

          <Select
            defaultValue={defaultLayout}
            onValueChange={(value) => { setDraftLayout(value as LayoutName) }}
            disabled={isBusy}
            >
            <SelectTrigger className="flex-grow">
              <SelectValue className="text-xs md:text-sm" placeholder="Layout" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(allLayouts).map(key =>
                <SelectItem key={key} value={key} className="w-full">
                  <div className="space-x-6 flex flex-row items-center justify-between font-mono">
                    <div className="flex">{
                      (allLayoutLabels as any)[key]
                    }</div>
                 
                      {(layoutIcons as any)[key]
                        ? <Image
                            className="rounded-sm opacity-75"
                            src={(layoutIcons as any)[key]}
                            width={20}
                            height={18}
                            alt={key}
                        /> : null}
              
                  </div>
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        {/*
        <div className={cn(
          `transition-all duration-200 ease-in-out`,
          `flex flex-row items-center space-x-3 font-mono w-1/2 md:w-auto md:hidden`
        )}>
          <Label className="flex text-xs md:text-sm md:w-24">Font:</Label>
          <Select
            defaultValue={fontList.includes(preset.font) ? preset.font : "cartoonist"}
            onValueChange={(value) => { setFont(value as FontName) }}
            disabled={atLeastOnePanelIsBusy}
            >
            <SelectTrigger className="flex-grow">
              <SelectValue className="text-xs md:text-sm" placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(fonts)
                .map((font) =>
                <SelectItem
                  key={font}
                  value={font}>{
                    font
                  }</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
          */}
      </div>
      <div className={cn(
          `transition-all duration-200 ease-in-out`,
          `flex flex-row flex-grow items-center space-x-3 font-mono w-full md:w-auto`
        )}>
        <Input
          placeholder="Story"
          className="w-full bg-neutral-300 text-neutral-800 dark:bg-neutral-300 dark:text-neutral-800"
          // disabled={atLeastOnePanelIsBusy}
          onChange={(e) => {
            setDraftPrompt(e.target.value)
          }}
          onKeyDown={({ key }) => {
            if (key === 'Enter') {
              handleSubmit()
            }
          }}
          value={draftPrompt}
         />
        <Button
          onClick={() => {
            handleSubmit()
          }}
          disabled={!draftPrompt?.trim().length || isBusy}
        >
          Generate
        </Button>
      </div>
      {/*
        Let's add this feature later, because right now people
        are confused about why they can't activate it
      <div className={cn(
          `transition-all duration-200 ease-in-out`,
          `hidden md:flex flex-row items-center space-x-3 font-mono w-full md:w-auto`
      )}>
        <Label className="flex text-xs md:text-sm w-24">Font:</Label>
        <Select
          defaultValue={fontList.includes(preset.font) ? preset.font : "actionman"}
          onValueChange={(value) => { setFont(value as FontName) }}
          // disabled={isBusy}
          disabled={true}
          >
          <SelectTrigger className="flex-grow">
            <SelectValue className="text-xs md:text-sm" placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(fonts)
              .map((font) =>
              <SelectItem
                key={font}
                value={font}>{
                  font
                }</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
              */}
    </div>
  )
}