"use client"
import { Avatar, IconButton, InputAdornment, Paper, TextField, Tooltip, Typography, Stack, Box, Chip, Button } from "@mui/material"
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer"
import Breadcrumb from "@/app/admin/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb"
import DataTable from "@/app/admin/(DashboardLayout)/components/tables/DataTable";
import { IconEdit, IconFilter, IconSearch, IconTrash } from "@tabler/icons-react";
import BlankCard from "@/app/admin/(DashboardLayout)/components/shared/BlankCard";
import { useTheme } from "@emotion/react";
import TableToolbar from "@/app/admin/(DashboardLayout)/components/tables/TableToolbar";
import DataTableWithToolbar from "@/app/admin/(DashboardLayout)/components/tables/DataTableWithToolbar";
import { useState } from "react";
import { debounce } from "lodash";
import useQueryParams from "@/hooks/useQueryParams";
import { useQuery } from "@tanstack/react-query";
import earningService from "@/services/earningService";
import { SweetAlert } from "@/utils/sweet-alert";
import moment from "moment"
import { useAdminContext } from "../../AdminContext";
import CreateNoticeDrawer from "./CreateNoticeDrawer";
import noticeboardService from "@/services/noticeboardService";
import Link from "next/link";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import { queryClient } from "@/utils/queryClient";
import { showToast } from "@/utils/lib";
// import DashboardCard from "@/app/admin/(DashboardLayout)/components/shared/DashboardCard"
const BCrumb = [
    {
        to: "/admin",
        title: "Home",
    },
    {
        title: "Notice",
    },
];


const SamplePage = () => {
    const {isFeatureAvailable} = useAdminContext()
    const [query, setQuery] = useQueryParams({
        page: 1,
        limit: 10
    })

    const { isPending, error, data } = useQuery({
        queryKey:['adminNotices', query],
        queryFn: () => noticeboardService.getAdminNotices(query)
    })

    const handleApprove = async (id) => {
        await earningService.updatePayoutStatusByAdmin(id, {
            status: 'paid'
        })
    }

    const handleDelete = (noticeId) => {
        Swal.fire({
          title: "Are you sure?",
          text: `Sure about removing this Notice? If you delete this notice, please note that it remains in the receiver device's push notification, just as you cannot delete a mobile text SMS once sent.`,
          icon: "warning",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete!",
          showCancelButton: true,
          showLoaderOnConfirm: true,
          allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
          if (result.isConfirmed) {
            noticeboardService.deleteNotice(noticeId).then((res) => {
              queryClient.invalidateQueries({
                queryKey: ["adminNotices"],
              });
              showToast("Notice Deleted Successfully!");
            });
          }
        });
      };

    return (
        <PageContainer title="Notices" description="this is Sample page">
            <Breadcrumb title="Notice" items={BCrumb} />

            <DataTableWithToolbar
                {...query}
                setQuery={setQuery}
                rows={data?.results}
                rowsCount={data?.totalCount}
                pagination
                isLoading={isPending}
                columns={[
                    {
                        key: 'id',
                        name: "ID"
                    },
                    {
                        key: 'title',
                        name: "Title",
                        
                    },
                    
                    {
                        key: 'receivers',
                        name: "Receiver (ID)",
                        template: (data) => <> {data.receivers?.length?<>{data.receivers?.join(', ')}</>: '-' }
                     </>

                    }, {
                        key: 'receiverType',
                        name: "Group",
                        template: (data) =><Chip sx={{
                           bgColor: (theme) => theme.palette.success.light,
                           color: (theme) => theme.palette.success,
                           borderRadius: '8px',
                        }} size="small" label={data.receiverType}  />

                    },
                    {
                        key: 'department',
                        name: "Department",
                        template: (data) => <>
                        {data.department?.name|| '-'}
                        <br/>
                        <Link href={`/admin/user-profile/${data?.createdBy}/profile`}>Created By: #{data?.createdBy || '-'}</Link>
                        
                        </> 

                    },
                    
                    {
                        key: 'dateTime',
                        name: "Date time",
                        template: (data) =><>
                        <Typography variant="subtitle2">
                            {data?.isScheduled ? <><span style={{color:'#ff9800'}}>Scheduled:</span> { moment(data?.scheduled).format('lll')  }</> : (data?.scheduled && <> <span style={{color:'#4caf50'}}>Delivered:</span>  {moment(data?.scheduled).format('lll')  }</>) }

                        </Typography>
                        <Typography variant="subtitle2">
                             <><span style={{color:(!data?.isScheduled && !data?.scheduled) ? '#4caf50' :'#2196F3'}}>Created { (!data?.isScheduled && !data?.scheduled) && 'And Delivered '} At: { (!data?.isScheduled && !data?.scheduled) &&  <br/>}</span> { moment(data?.createdAt).format('lll') }</>  

                        </Typography> 
                        </>

                    },
                    {
                        key: 'action',
                        name: "Action",
                        template: (data) => isFeatureAvailable('delete_notice', 'AdminNoticeBoardModule')  ? <>
                       <Button color="error" sx={{
                        fontSize: '14px',
                        padding: 0
                       }} onClick={() => handleDelete(data?.id)}> <MdDeleteForever /> </Button> 
                        
                        </> : '-'

                    },
                    // {
                    //     key: 'more',
                    //     name: "Action",
                    //     type: "menu",
                    //     menu: [
                    //         {
                    //             label: "Edit",
                    //             icon: <IconEdit size={18} />,
                    //             fn: (item, closeFn) => {
                    //                 console.log(item, closeFn)
                    //             }
                    //         },
                    //     ]
                    // }
                ]}
                renderLeftContent={() => (
                    <Typography variant="h6">All Notices</Typography>
                )}
                renderAction={() =>( isFeatureAvailable('create_notice', 'AdminNoticeBoardModule') ? <CreateNoticeDrawer /> : null
                  
                )}

            />


        </PageContainer>
    )
}

export default SamplePage
