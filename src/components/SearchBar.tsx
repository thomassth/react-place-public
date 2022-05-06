import React, { useState } from 'react';
import { IconButton, PrimaryButton, Stack, TextField } from '@fluentui/react';

//A module which allows user to input the name of a location. (Searching feature is triggered by both button click, and press enter key on the keyboard)
//A button to support user location acquisition from browser.
export function SearchBar(props: {
    getLoc: () => void;
    getGeocode: (arg0: string) => void
}) {
    const [textField, setTextField] = useState('')

    return (
        <div className='search-bar'>
            <Stack horizontal>
                <Stack.Item grow>
                    <TextField
                        onChange={(event) => {
                            var element = event.target as HTMLTextAreaElement
                            setTextField(element.value)
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                props.getGeocode(textField)
                            }
                        }}
                    />
                </Stack.Item>
                <IconButton
                    iconProps={{ iconName: 'Location' }}
                    title="locate"
                    ariaLabel='locate'
                    onClick={() => props.getLoc()} />
                <PrimaryButton
                    onClick={() => props.getGeocode(textField)}>
                    Search
                </PrimaryButton>
            </Stack>
        </div>
    );
}

