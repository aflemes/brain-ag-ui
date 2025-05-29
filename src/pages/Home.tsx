import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import type { SvgIconProps } from '@mui/material';
import { Person, Landscape, Grass, CalendarMonth } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart } from '@mui/x-charts/PieChart';
import { ProdutorService, PropriedadeService, CulturaService, SafraService } from '../services';

interface StatCard {
    title: string;
    icon: ReactElement<SvgIconProps>;
    value: string;
    path: string;
}

interface ChartData {
    id: number;
    value: number;
    label: string;
}

export default function Home() {
    const navigate = useNavigate();
    const [stateData, setStateData] = useState<ChartData[]>([]);
    const [cropData, setCropData] = useState<ChartData[]>([]);
    const [landUseData, setLandUseData] = useState<ChartData[]>([]);

    const [stats, setStats] = useState<StatCard[]>([
        {
            title: 'Total de Produtores',
            icon: <Person sx={{ fontSize: 40 }} />,
            value: '...',
            path: '/'
        },
        {
            title: 'Total de Propriedades',
            icon: <Landscape sx={{ fontSize: 40 }} />,
            value: '...',
            path: '/'
        },
        {
            title: 'Culturas Cadastradas',
            icon: <Grass sx={{ fontSize: 40 }} />,
            value: '...',
            path: '/'
        },
        {
            title: 'Safras Registradas',
            icon: <CalendarMonth sx={{ fontSize: 40 }} />,
            value: '...',
            path: '/'
        }
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [produtores, propriedades, culturas, safras] = await Promise.all([
                    ProdutorService.getAll(),
                    PropriedadeService.getAll(),
                    CulturaService.getAll(),
                    SafraService.getAll()
                ]);

                setStats(prevStats => [
                    { ...prevStats[0], value: produtores.data.length.toString() },
                    { ...prevStats[1], value: propriedades.data.length.toString() },
                    { ...prevStats[2], value: culturas.data.length.toString() },
                    { ...prevStats[3], value: safras.data.length.toString() }
                ]);

                // Calculate state distribution
                const stateCount = propriedades.data.reduce((acc: { [key: string]: number }, prop: any) => {
                    acc[prop.estado] = (acc[prop.estado] || 0) + 1;
                    return acc;
                }, {});

                setStateData(Object.entries(stateCount).map(([estado, count], index) => ({
                    id: index,
                    label: estado,
                    value: count
                })));

                // Calculate total areas
                let totalAgricultavel = 0;
                let totalVegetacao = 0;

                propriedades.data.forEach((prop: any) => {
                    totalAgricultavel += prop.area_agricultavel;
                    totalVegetacao += prop.area_vegetacao;
                });

                setLandUseData([
                    { id: 0, label: 'Área Agricultável', value: totalAgricultavel },
                    { id: 1, label: 'Área de Vegetação', value: totalVegetacao }
                ]);

                // Busca os dados de culturas plantadas
                // e calcula a distribuição por cultura
                const culturasPlantadas = await fetch(`${import.meta.env.VITE_API_URL}/culturas-plantadas`).then(res => res.json());
                const cropCount = culturasPlantadas.reduce((acc: { [key: string]: number }, cp: any) => {
                    const culturaNome = culturas.data.find((c: any) => c.id === cp.cultura_id)?.nome;
                    if (culturaNome) {
                        acc[culturaNome] = (acc[culturaNome] || 0) + 1;
                    }
                    return acc;
                }, {});

                setCropData(Object.entries(cropCount).map(([cultura, count], index) => ({
                    id: index,
                    label: cultura,
                    value: Number(count)
                })));
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                useFlexGap
                flexWrap="wrap"
                sx={{
                    width: '100%',
                    '& > *': {
                        minWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(25% - 16px)' }
                    }
                }}
            >
                {stats.map((card) => (
                    <Card
                        key={card.title}
                        sx={{
                            cursor: 'pointer',
                            flex: 1,
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                transform: 'translateY(-2px)',
                                transition: 'all 0.2s ease-in-out'
                            }
                        }}
                        onClick={() => navigate(card.path)}
                    >
                        <CardContent sx={{ textAlign: 'center' }}>
                            {card.icon}
                            <Typography variant="h6" component="div" sx={{ mt: 1 }}>
                                {card.title}
                            </Typography>
                            <Typography variant="h4" color="primary">
                                {card.value}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Stack>

            {/* Charts Section */}
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={3}
                sx={{ mt: 4 }}
                useFlexGap
            >
                <Card sx={{ flex: 1 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom textAlign="center">
                            Distribuição por Estado
                        </Typography>
                        {stateData.length > 0 && (
                            <Box sx={{ width: '100%', height: 300 }}>
                                <PieChart
                                    series={[{
                                        data: stateData,
                                        highlightScope: { fade: 'global', highlight: 'item' },
                                        faded: { innerRadius: 30, additionalRadius: -30 },
                                    }]}
                                    height={300}
                                />
                            </Box>
                        )}
                    </CardContent>
                </Card>

                <Card sx={{ flex: 1 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom textAlign="center">
                            Culturas Plantadas
                        </Typography>
                        {cropData.length > 0 && (
                            <Box sx={{ width: '100%', height: 300 }}>
                                <PieChart
                                    series={[{
                                        data: cropData,
                                        highlightScope: { fade: 'global', highlight: 'item' },
                                        faded: { innerRadius: 30, additionalRadius: -30 },
                                    }]}
                                    height={300}
                                />
                            </Box>
                        )}
                    </CardContent>
                </Card>

                <Card sx={{ flex: 1 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom textAlign="center">
                            Uso do Solo
                        </Typography>
                        {landUseData.length > 0 && (
                            <Box sx={{ width: '100%', height: 300 }}>
                                <PieChart
                                    series={[{
                                        data: landUseData,
                                        highlightScope: { fade: 'global', highlight: 'item' },
                                        faded: { innerRadius: 30, additionalRadius: -30 },
                                    }]}
                                    height={300}
                                />
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Stack>
        </Box>
    );
}
