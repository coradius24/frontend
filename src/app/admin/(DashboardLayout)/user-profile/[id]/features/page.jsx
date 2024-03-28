"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import useApp from "@/hooks/useApp";
import accessControlService from "@/services/accessControlService";
import userService from "@/services/userService";
import { showToast } from "@/utils/lib";
import { queryClient } from "@/utils/queryClient";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import CustomCheckbox from "../../../components/forms/theme-elements/CustomCheckbox";
import ChildCard from "../../../components/shared/ChildCard";
import ParentCard from "../../../components/shared/ParentCard";
import "./cascading-layout.css";

const SamplePage = ({ params }) => {
  const { user } = useApp();
  const [selected, setSelected] = useState([]);
  const { isPending, error, data } = useQuery({
    queryKey: ["adminAllFeatures"],
    queryFn: () => accessControlService.getAllFeatures(),
  });

  const { data: userInfo } = useQuery({
    queryKey: ["adminSingleUserById", params.id],
    queryFn: () => userService.getUserById(params.id),
  });
  const { data: usersFeatures } = useQuery({
    queryKey: ["adminAllFeaturesByUserId", params.id],
    queryFn: () => accessControlService.getAllFeaturesByUserId(params.id),
  });

  const handleUpdate = async () => {
    try {
      await accessControlService.updateUserFeatures(params.id, selected);
      showToast("Features Updated!");
      queryClient.invalidateQueries(["adminAllFeaturesByUserId", params.id]);
    } catch (error) {
      showToast("Failed to save!", "error");
    }
  };

  useEffect(() => {
    if (usersFeatures) {
      setSelected(usersFeatures?.map(({ id }) => id) || []);
    }
  }, [usersFeatures]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.id);
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
  };

  const handleSelectClick = useCallback((event, featureId) => {
    setSelected((prevSelected) => {
      const newSelected = new Set(prevSelected);

      if (newSelected.has(featureId)) {
        newSelected.delete(featureId);
      } else {
        newSelected.add(featureId);
      }

      return Array.from(newSelected);
    });
  }, []);

  const featureGroup = useMemo(() => {
    const grouped = {};

    if (userInfo?.role == 0) {
      grouped["Student Features"] = data?.filter(
        (ft) => ft.featureGroup == "Student Features"
      );
      return grouped;
    }

    if (data) {
      data.forEach((feature) => {
        const groupName = feature.featureGroup;
        if (groupName) {
          grouped[groupName] = grouped[groupName] || [];
          grouped[groupName].push(feature);
        }
      });
    }

    return grouped;
  }, [data, userInfo?.role]);

  const checkIfAllFeaturesOfAGroupSelected = useCallback(
    (group) => {
      const featuresOfAGroup = featureGroup[group] || [];
      return featuresOfAGroup.every(({ id }) => selected.includes(id));
    },
    [featureGroup, selected]
  );

  const handleGroupSelectClick = useCallback(
    (event, group) => {
      setSelected((prevSelected) => {
        const newSelected = new Set(prevSelected);

        const featuresOfAGroup = featureGroup[group] || [];
        const isChecked = event.target.checked;

        featuresOfAGroup.forEach(({ id: featureId }) => {
          if (isChecked) {
            newSelected.add(featureId);
          } else {
            newSelected.delete(featureId);
          }
        });

        return Array.from(newSelected);
      });
    },
    [featureGroup]
  );

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <PageContainer title="Course Enrollments" description="This is Sample page">
      <Box my={2}>
        <ParentCard title="Features">
          {((user?.role === 5 && userInfo?.role !== 5) ||
            (user?.role === 1 && userInfo?.role === 0)) && (
            <Stack
              direction="row"
              spacing={5}
              sx={{ mt: "-63px", justifyContent: "end" }}
            >
              {userInfo?.role !== 0 && (
                <label>
                  <CustomCheckbox
                    color="primary"
                    checked={
                      data?.length > 0 &&
                      selected.length ===
                        data?.filter((d) => d.featureGroup)?.length
                    }
                    onChange={handleSelectAllClick}
                    inputProps={{ "aria-label": "select all desserts" }}
                  />
                  Select All
                </label>
              )}

              <Button variant="contained" onClick={handleUpdate}>
                Save
              </Button>
            </Stack>
          )}

          <div className="masonry">
            <div className="grid js-masonry">
              {Object.keys(featureGroup)?.map((featureGroupName) => (
                <Box className="item" key={featureGroupName}>
                  <ChildCard>
                    <Stack
                      direction="row"
                      sx={{
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="h6">{featureGroupName}</Typography>
                      {((user?.role === 5 && userInfo?.role !== 5) ||
                        (user?.role === 1 && userInfo?.role === 0)) && (
                        <label>
                          <CustomCheckbox
                            color="primary"
                            checked={checkIfAllFeaturesOfAGroupSelected(
                              featureGroupName
                            )}
                            onChange={(e) =>
                              handleGroupSelectClick(e, featureGroupName)
                            }
                            inputProps={{ "aria-label": "select all desserts" }}
                          />
                          Select All
                        </label>
                      )}
                    </Stack>
                    <ul>
                      {featureGroup[featureGroupName]?.map((feature) => (
                        <Stack direction="row" style={{}} key={feature.id}>
                          <label>
                            <CustomCheckbox
                              disabled={
                                !(
                                  (user?.role === 5 && userInfo?.role !== 5) ||
                                  (user?.role === 1 && userInfo?.role === 0)
                                )
                              }
                              color="primary"
                              checked={selected.includes(feature.id)}
                              onClick={(event) =>
                                handleSelectClick(event, feature.id)
                              }
                              inputProps={{
                                "aria-label": "select all desserts",
                              }}
                            />
                            {feature?.name}
                          </label>
                        </Stack>
                      ))}
                    </ul>
                  </ChildCard>
                </Box>
              ))}
            </div>
          </div>
        </ParentCard>
      </Box>
    </PageContainer>
  );
};

export default SamplePage;
