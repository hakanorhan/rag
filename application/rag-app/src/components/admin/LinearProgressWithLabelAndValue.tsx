/**
 * Material UI – Linear Progress Component Documentation: https://mui.com/material-ui/react-progress/
 * Based on the official Material UI Linear Progess mode example, customized for project-specific requirements.
 */
import * as React from "react";
import Box from "@mui/material/Box";
import LinearProgress, {
  type LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";

function LinearProgressWithLabelAndValue(
  props: LinearProgressProps & { label: string; value: number },
) {
  const progressId = React.useId();
  const { label, ...progressProps } = props;
  return (
    <div>
      <Typography id={progressId} variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress
            variant="determinate"
            aria-labelledby={progressId}
            {...progressProps}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
    </div>
  );
}

export default function LinearWithValueLabel({ label }: { label: string }) {
  const [progress, setProgress] = React.useState(10);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabelAndValue label={label} value={progress} />
    </Box>
  );
}
