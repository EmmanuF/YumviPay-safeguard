
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useRedirectHandler = () => {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const showLoadingOverlay = () => {
    const loadingDiv = document.createElement('div');
    loadingDiv.style.position = 'fixed';
    loadingDiv.style.top = '0';
    loadingDiv.style.left = '0';
    loadingDiv.style.width = '100%';
    loadingDiv.style.height = '100%';
    loadingDiv.style.backgroundColor = 'rgba(0,0,0,0.5)';
    loadingDiv.style.display = 'flex';
    loadingDiv.style.justifyContent = 'center';
    loadingDiv.style.alignItems = 'center';
    loadingDiv.style.zIndex = '10000';
    loadingDiv.innerHTML = `
      <div style="background: white; padding: 20px; border-radius: 8px; text-align: center;">
        <h3>Preparing Transaction...</h3>
        <p>Please wait while we securely prepare your transaction.</p>
      </div>
    `;
    document.body.appendChild(loadingDiv);
    return loadingDiv;
  };

  const hideLoadingOverlay = (loadingDiv: HTMLDivElement) => {
    try {
      document.body.removeChild(loadingDiv);
    } catch (e) {
      console.error('Error removing loading div:', e);
    }
  };

  const handleKadoRedirect = async (
    transactionId: string,
    transactionData: any,
    redirectToKadoAndReturn: (data: any) => Promise<void>
  ) => {
    setIsRedirecting(true);
    const loadingDiv = showLoadingOverlay();
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const testMode = true;
      
      if (testMode) {
        console.log('🧪 TEST MODE: Using Kado redirect service directly');
        
        try {
          const { kadoRedirectService } = await import('@/services/kado/redirect');
          
          await kadoRedirectService.redirectToKado({
            amount: transactionData.amount.toString(),
            recipientName: transactionData.recipientName || 'Recipient',
            recipientContact: transactionData.recipientContact || transactionData.recipient || '',
            country: transactionData.targetCountry || 'CM',
            paymentMethod: transactionData.paymentMethod || 'mobile_money',
            transactionId,
            returnUrl: `/transaction/${transactionId}`
          });
          
          // If we get here, the redirect didn't happen - force navigation
          navigate(`/transaction/${transactionId}`, { replace: true });
        } catch (e) {
          console.error('Error using direct Kado redirect service:', e);
          // Fallback to transaction page
          navigate(`/transaction/${transactionId}`, { replace: true });
        } finally {
          hideLoadingOverlay(loadingDiv);
        }
        
        return;
      }
      
      await redirectToKadoAndReturn({
        amount: transactionData.amount.toString(),
        recipientName: transactionData.recipientName || 'Recipient',
        recipientContact: transactionData.recipientContact || transactionData.recipient || '',
        country: transactionData.targetCountry || 'CM',
        paymentMethod: transactionData.paymentMethod || 'mobile_money',
        transactionId,
      });
      
    } catch (error) {
      console.error('Error during Kado redirect:', error);
      toast.error("Redirect Error", {
        description: "Failed to connect to payment provider. Please try again."
      });
      return false;
    } finally {
      hideLoadingOverlay(loadingDiv);
      setIsRedirecting(false);
    }
    
    return true;
  };

  return {
    isRedirecting,
    handleKadoRedirect,
    navigate
  };
};
