'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { InstructorCard } from './InstructorCard'
import update from 'immutability-helper'
import ParentCard from '../../components/shared/ParentCard'
import { Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import cmsService from '@/services/cmsService'


function Page() {
    const style = {
        width: 400,
    }
    const { isPending, error, data } = useQuery({
        queryKey: ["AdminFeaturedInstructors"],
        queryFn: () => cmsService.getFeaturedInstructors(),
    });
    const [cards, setCards] = useState([])
    useEffect(() => {
        setCards(data||[])
    }, [data])
    const moveCard = useCallback((dragIndex, hoverIndex) => {
        setCards((prevCards) =>
            update(prevCards, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, prevCards[dragIndex]],
                ],
            }),
        )
    }, [])


    const renderCard = useCallback(
        (card, index) => {
            return (
                <InstructorCard
                    key={card.id}
                    index={index}
                    id={card.id}
                    text={card.text}
                    moveCard={moveCard}
                />
            )
        },
        [],
    )
    return (
        <Box mt={3}>
            <ParentCard
             title="Featured Instructors"
             
             >
                <Box sx={{
                    maxWidth: 500,
                    m: 'auto',
                    py: 5
                }}>
                <DndProvider backend={HTML5Backend}>
                    <div style={style}>{cards.map((card, i) => renderCard(card, i))}</div>
                </DndProvider>
                </Box>
            </ParentCard>
        </Box>

    )
}

export default Page