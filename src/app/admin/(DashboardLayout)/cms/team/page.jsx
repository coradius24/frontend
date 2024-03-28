"use client";
import { useAdminContext } from "@/app/admin/AdminContext";
import cmsService from "@/services/cmsService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { SweetAlert } from "@/utils/sweet-alert";
import { Box, Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import update from "immutability-helper";
import { useQueryState } from "next-usequerystate";
import { useCallback, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ParentCard from "../../components/shared/ParentCard";
import AddTeamMemberModal from "./AddTeamMemberModal";
import { TeamMemberCard } from "./TeamMemberCard";
import "./team.css";

function Page() {
  const { isPending, error, data } = useQuery({
    queryKey: ["AdminTeamMembers"],
    queryFn: () => cmsService.getTeamMembersByAdmin({ limit: 50 }),
  });
  const [cards, setCards] = useState([]);

  const [open, setOpen] = useState(false);

  const [selected, setSelected] = useState(null);
  const [action, setAction] = useQueryState("action");

  const { isFeatureAvailable } = useAdminContext();

  useEffect(() => {
    if (!open) {
      setSelected(null);
      setAction(null);
    }
  }, [open]);

  useEffect(() => {
    if (selected) {
      setOpen(true);
    }
  }, [selected]);

  const handleEdit = (card) => {
    setAction("edit");
    setSelected(card);
  };

  const handleDelete = async (id) => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: `You want to delete the Team Member!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, continue!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await cmsService.removeTeamMember(id);
          if (res?.raw) {
            queryClient.invalidateQueries(["AdminTeamMembers"]);
            showToast(`Successfully Delete!`);
          } else {
            showToast(res.message, "error");
          }
        } catch (error) {
          showToast("Failed to delete", "error");
        }
      }
    });
  };
  useEffect(() => {
    setCards(data?.results || []);
  }, [data]);
  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setCards((prevCards) => {
      const newData = update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      });
      cmsService
        .reorderTeamMembers({
          payloadArray: newData?.map((d, i) => ({
            id: d.id,
            serialNumber: i + 1,
          })),
        })
        .then((res) => {});
      return newData;
    });
  }, []);

  const renderCard = useCallback((card, index) => {
    return (
      <TeamMemberCard
        key={card.id}
        index={index}
        id={card.id}
        {...card}
        moveCard={moveCard}
        handleEdit={() => handleEdit(card)}
        handleDelete={handleDelete}
      />
    );
  }, []);
  return (
    <Box mt={3}>
      <ParentCard
        title="Team"
        action={
          <>
            <AddTeamMemberModal
              open={open}
              setOpen={setOpen}
              data={selected}
              action={action}
              setAction={setAction}
            />
          </>
        }
      >
        <Box
          sx={{
            // maxWidth: 500,
            m: "auto",
            p: 5,
          }}
        >
          <DndProvider backend={HTML5Backend}>
            <Grid className="team-grid" container spacing={3}>
              {cards.map((card, i) => renderCard(card, i))}
            </Grid>
          </DndProvider>
        </Box>
      </ParentCard>
    </Box>
  );
}

export default Page;
