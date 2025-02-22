import { FiCheck, FiExternalLink } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

import { Stack } from '@stacks/ui';
import get from 'lodash.get';

import { createMoney } from '@shared/models/money.model';

import { HandleOpenTxLinkArgs } from '@app/common/hooks/use-explorer-link';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { formatMoney } from '@app/common/money/format-money';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import {
  InfoCard,
  InfoCardAssetValue,
  InfoCardBtn,
  InfoCardFooter,
  InfoCardRow,
  InfoCardSeparator,
} from '@app/components/info-card/info-card';
import { InfoLabel } from '@app/components/info-label';
import { Link } from '@app/components/link';
import { ModalHeader } from '@app/components/modal-header';

function useBrc20SentSummaryState() {
  const location = useLocation();
  return {
    fee: get(location.state, 'fee') as string,
    serviceFee: get(location.state, 'serviceFee') as string,
    totalFee: get(location.state, 'totalFee') as string,
    recipient: get(location.state, 'recipient') as string,
    tick: get(location.state, 'tick') as string,
    amount: get(location.state, 'amount') as string,
    txId: get(location.state, 'txId') as string,
    txLink: get(location.state, 'txLink') as HandleOpenTxLinkArgs,
  };
}

export function Brc20SentSummary() {
  const { fee, tick, amount, serviceFee, totalFee } = useBrc20SentSummaryState();
  const amountFormatted = formatMoney(createMoney(Number(amount), tick, 0));
  const navigate = useNavigate();

  function onClickLink() {
    navigate('/');
  }

  useRouteHeader(<ModalHeader hideActions defaultClose title="Creating transfer inscription" />);

  return (
    <InfoCard>
      <InfoCardAssetValue
        value={Number(amount)}
        symbol={tick}
        icon={FiCheck}
        my="loose"
        px="loose"
      />

      <Stack width="100%" px="extra-loose" pb="extra-loose">
        <InfoLabel mb="loose" title="One more step is required to send tokens">
          {`You'll need to send the transfer inscription to your recipient of choice from the home screen once its status changes to "Ready to send"`}
          <br />
          <br />
          <Link
            fontSize={1}
            fontWeight={500}
            lineHeight="1.6"
            onClick={() => {
              openInNewTab('https://hirowallet.gitbook.io/guides/bitcoin/sending-brc-20-tokens');
            }}
          >
            {'Learn more'}
          </Link>
        </InfoLabel>
        <InfoCardSeparator />

        <InfoCardRow title="Sending" value={amountFormatted} />
        <InfoCardRow title="Inscription service fee" value={serviceFee} />
        <InfoCardRow title="Payment transaction fee" value={fee} />

        <InfoCardSeparator />
        <InfoCardRow title="Total fee" value={totalFee} />
      </Stack>
      <InfoCardFooter>
        <Stack spacing="base" isInline width="100%">
          <InfoCardBtn
            onClick={onClickLink}
            icon={FiExternalLink}
            label="Pending BRC-20 transfers"
          />
        </Stack>
      </InfoCardFooter>
    </InfoCard>
  );
}
